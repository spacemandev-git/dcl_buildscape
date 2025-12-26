<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { useGltf } from '@threlte/extras';
	import * as THREE from 'three';
	import { inventory, type ItemDefinition } from '$lib/stores/inventory.svelte';

	interface Props {
		item: ItemDefinition;
		bone: THREE.Bone;
	}

	let { item, bone }: Props = $props();

	const gltf = useGltf(item.path);
	let itemScene: THREE.Object3D | null = null;

	// Store base scale for calculations
	let baseItemScale = 1;

	// Attach to bone when model loads - only depends on model and bone
	$effect(() => {
		const model = $gltf;
		console.log('ItemAttachment effect:', { model: !!model, bone: bone?.name, item: item.name });

		if (model && bone) {
			console.log('Attaching item:', item.name, 'to bone:', bone.name);

			// Clone the scene so we can modify it
			itemScene = model.scene.clone();

			// Apply shadows
			itemScene.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});

			// Store the base scale from the item's original transform
			baseItemScale = itemScene.scale.x; // Usually 100 from the GLB

			// Apply initial transforms using item defaults
			const defaultPosition = item.positionOffset ?? [0, 0, 0];
			const defaultRotation = item.rotationOffset ?? [0, 0, 0];
			const defaultScale = item.scale ?? 1;

			itemScene.position.set(...defaultPosition);
			itemScene.rotation.set(...defaultRotation);
			// Apply armature compensation (0.01) and item's configured scale
			itemScene.scale.setScalar(baseItemScale * 0.01 * defaultScale);

			// Attach to bone
			bone.add(itemScene);
			console.log('Item attached, bone children count:', bone.children.length);

			const sceneRef = itemScene;
			// Cleanup on unmount or when bone/item changes
			return () => {
				console.log('Cleanup: removing item from bone');
				bone.remove(sceneRef);
				sceneRef.traverse((child) => {
					if (child instanceof THREE.Mesh) {
						child.geometry?.dispose();
						if (Array.isArray(child.material)) {
							child.material.forEach((m) => m.dispose());
						} else {
							child.material?.dispose();
						}
					}
				});
				itemScene = null;
			};
		}
	});

	// Update rotation when override changes
	$effect(() => {
		const override = inventory.rotationOverride;
		if (itemScene) {
			const rotation = override ?? item.rotationOffset ?? [0, 0, 0];
			itemScene.rotation.set(...rotation);
		}
	});

	// Update position when override changes
	$effect(() => {
		const override = inventory.positionOverride;
		if (itemScene) {
			const position = override ?? item.positionOffset ?? [0, 0, 0];
			itemScene.position.set(...position);
		}
	});

	// Update scale when override changes
	$effect(() => {
		const scaleOverride = inventory.scaleOverride;
		if (itemScene) {
			const userScale = scaleOverride ?? item.scale ?? 1;
			itemScene.scale.setScalar(baseItemScale * 0.01 * userScale);
		}
	});
</script>

<!-- No visual output needed - item is attached directly to the bone -->
