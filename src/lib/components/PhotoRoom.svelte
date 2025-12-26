<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls, Grid } from '@threlte/extras';
	import AvatarLoader from './AvatarLoader.svelte';
	import * as THREE from 'three';

	interface Props {
		avatarUrl: string;
		animationIndex?: number;
		paused?: boolean;
		onAnimationsLoaded?: (names: string[]) => void;
		onSkeletonLoaded?: (skeleton: Map<string, THREE.Bone>) => void;
	}

	let { avatarUrl, animationIndex = 0, paused = false, onAnimationsLoaded, onSkeletonLoaded }: Props = $props();
</script>

<!-- Camera with orbit controls -->
<T.PerspectiveCamera makeDefault position={[0, 1.5, 3]} fov={50}>
	<OrbitControls
		enableDamping
		dampingFactor={0.1}
		target={[0, 1, 0]}
		minDistance={1}
		maxDistance={10}
		maxPolarAngle={Math.PI * 0.9}
	/>
</T.PerspectiveCamera>

<!-- Lighting setup for photo studio -->
<T.AmbientLight intensity={0.4} />

<!-- Key light (main) -->
<T.DirectionalLight
	position={[3, 4, 2]}
	intensity={1.2}
	castShadow
	shadow.mapSize.width={2048}
	shadow.mapSize.height={2048}
	shadow.camera.near={0.5}
	shadow.camera.far={20}
/>

<!-- Fill light -->
<T.DirectionalLight position={[-2, 3, 1]} intensity={0.6} />

<!-- Rim/back light -->
<T.DirectionalLight position={[0, 2, -3]} intensity={0.8} />

<!-- Bottom fill -->
<T.PointLight position={[0, 0.5, 2]} intensity={0.3} />

<!-- Photo studio backdrop - curved cyclorama -->
<T.Mesh position={[0, 2.5, -3]} receiveShadow>
	<T.PlaneGeometry args={[10, 6]} />
	<T.MeshStandardMaterial color="#2a2a4a" />
</T.Mesh>

<!-- Floor -->
<T.Mesh rotation.x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
	<T.CircleGeometry args={[5, 64]} />
	<T.MeshStandardMaterial color="#252540" />
</T.Mesh>

<!-- Subtle grid for reference -->
<Grid
	position={[0, 0.01, 0]}
	cellColor="#3a3a5a"
	sectionColor="#4a4a6a"
	fadeDistance={8}
	cellSize={0.5}
	sectionSize={2}
	infiniteGrid
/>

<!-- Avatar -->
{#if avatarUrl}
        {#key avatarUrl}
                <AvatarLoader url={avatarUrl} {animationIndex} {paused} {onAnimationsLoaded} {onSkeletonLoaded} />
        {/key}
{/if}
