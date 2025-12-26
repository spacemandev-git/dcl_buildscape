<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { useGltf } from '@threlte/extras';
	import { untrack } from 'svelte';
	import * as THREE from 'three';
	import ItemAttachment from './ItemAttachment.svelte';
	import { inventory, findBone, type ItemDefinition } from '$lib/stores/inventory.svelte';

	interface Props {
		url: string;
		position?: [number, number, number];
		rotation?: [number, number, number];
		scale?: number;
		animationIndex?: number;
		onAnimationsLoaded?: (names: string[]) => void;
		onSkeletonLoaded?: (skeleton: Map<string, THREE.Bone>) => void;
	}

	let {
		url,
		position = [0, 0, 0],
		rotation = [0, 0, 0],
		scale = 1,
		animationIndex = 0,
		onAnimationsLoaded,
		onSkeletonLoaded
	}: Props = $props();

	let gltf = useGltf(url);
	let mixer: THREE.AnimationMixer | null = null;
	let currentAction: THREE.AnimationAction | null = null;
	let currentUrl = '';
	let animations: THREE.AnimationClip[] = [];
	let lastAnimIndex = -1;
	let skeleton = $state<Map<string, THREE.Bone>>(new Map());
	let equippedItems = $derived(inventory.getEquippedItems());

	// Set up shadows and animation mixer when model loads
	$effect(() => {
		const model = $gltf;
		if (model && url !== currentUrl) {
			untrack(() => {
				currentUrl = url;
				animations = model.animations || [];
				lastAnimIndex = -1;

				// Build skeleton map for bone attachments
				const newSkeleton = new Map<string, THREE.Bone>();
				model.scene.traverse((child) => {
					if (child instanceof THREE.Mesh) {
						child.castShadow = true;
						child.receiveShadow = true;
					}
					if (child instanceof THREE.Bone) {
						newSkeleton.set(child.name, child);
					}
				});
				skeleton = newSkeleton;

				// Report skeleton to parent if callback provided
				if (onSkeletonLoaded && newSkeleton.size > 0) {
					onSkeletonLoaded(newSkeleton);
					console.log('Available bones:', Array.from(newSkeleton.keys()));
				}

				// Set up animation mixer if model has animations
				if (animations.length > 0) {
					mixer = new THREE.AnimationMixer(model.scene);

					// Report animation names to parent (cleaned up)
					if (onAnimationsLoaded) {
						onAnimationsLoaded(animations.map((a, i) => {
							let name = a.name || `Animation ${i}`;
							// Strip armature prefix (e.g., "CharacterArmature|Idle" -> "Idle")
							if (name.includes('|')) {
								name = name.split('|').pop() || name;
							}
							// Replace underscores with spaces
							name = name.replace(/_/g, ' ');
							// Add spaces before capital letters (camelCase -> Camel Case)
							name = name.replace(/([a-z])([A-Z])/g, '$1 $2');
							return name;
						}));
					}

					// Find and play idle animation by default, fallback to first
					let idleIndex = animations.findIndex(a =>
						a.name.toLowerCase().includes('idle')
					);
					if (idleIndex === -1) idleIndex = 0;

					playAnimation(idleIndex);
					lastAnimIndex = idleIndex;
				} else {
					mixer = null;
					if (onAnimationsLoaded) {
						onAnimationsLoaded([]);
					}
				}
			});
		}
	});

	// Handle animation index changes - read animationIndex OUTSIDE untrack
	$effect(() => {
		const idx = animationIndex; // Read the prop (creates dependency)

		if (mixer && animations.length > 0 && idx >= 0 && idx !== lastAnimIndex) {
			untrack(() => {
				playAnimation(idx);
				lastAnimIndex = idx;
			});
		}
	});

	function playAnimation(index: number) {
		if (!mixer || !animations[index]) return;

		// Stop current animation
		if (currentAction) {
			currentAction.fadeOut(0.3);
		}

		// Play new animation
		currentAction = mixer.clipAction(animations[index]);
		currentAction.reset();
		currentAction.fadeIn(0.3);
		currentAction.play();
	}

	// Update animation mixer
	useTask((delta) => {
		if (mixer) {
			mixer.update(delta);
		}
	});
</script>

{#if $gltf}
	<T.Group position={position} rotation={rotation} scale={[scale, scale, scale]}>
		<T is={$gltf.scene} />
	</T.Group>

	<!-- Render equipped items attached to bones -->
	{#each equippedItems as { item, boneName } (item.path)}
		{@const bone = findBone(skeleton, boneName)}
		{#if bone}
			<ItemAttachment {item} {bone} />
		{:else}
			{@const _ = console.log('Bone not found:', boneName, 'for item:', item.name)}
		{/if}
	{/each}
{:else}
	<!-- Loading placeholder -->
	<T.Mesh position={position}>
		<T.BoxGeometry args={[0.5, 1.8, 0.3]} />
		<T.MeshStandardMaterial color="#6366f1" wireframe />
	</T.Mesh>
{/if}
