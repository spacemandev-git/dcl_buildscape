<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { browser } from '$app/environment';
	import PhotoRoom from '$lib/components/PhotoRoom.svelte';
	import ControlPanel from '$lib/components/ControlPanel.svelte';
	import SettingsPanel from '$lib/components/SettingsPanel.svelte';
	import AnimationTimeline from '$lib/components/AnimationTimeline.svelte';
	import { inventory } from '$lib/stores/inventory.svelte';
	import { settings } from '$lib/stores/settings.svelte';
	import * as THREE from 'three';

	let avatarUrl = $state('');
	let isLoading = $state(false);
	let canvasElement: HTMLCanvasElement | null = $state(null);
	let animations = $state<string[]>([]);
	let animationIndex = $state(0);
	let hasSkeleton = $state(false);
	let paused = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let scrubTime = $state<number | null>(null);
	let cycling = $state(false);
	let restartTrigger = $state(0);

	function handleUrlChange(url: string) {
		const trimmedUrl = url.trim();
		if (!trimmedUrl || trimmedUrl === avatarUrl) return;
		isLoading = true;
		avatarUrl = trimmedUrl;
		animations = [];
		animationIndex = 0;
		hasSkeleton = false;
		if (!settings.persistInventory) {
			inventory.clearAll();
		}
		setTimeout(() => {
			isLoading = false;
		}, 2000);
	}

	function handleAnimationsLoaded(names: string[]) {
		animations = names;
	}

	function handleAnimationChange(index: number) {
		animationIndex = index;
		scrubTime = null; // Clear scrub state when changing animation
	}

	function handleSkeletonLoaded(skeleton: Map<string, THREE.Bone>) {
		hasSkeleton = skeleton.size > 0;
		if (hasSkeleton) {
			console.log('Skeleton loaded with bones:', Array.from(skeleton.keys()));
		}
	}

	function handleTimeUpdate(time: number, dur: number) {
		if (scrubTime === null) {
			currentTime = time;
		}
		duration = dur;
	}

	function handleScrub(time: number | null) {
		scrubTime = time;
		if (time !== null) {
			currentTime = time;
		}
	}

	function handleStepFrame(direction: -1 | 1) {
		const frameTime = 1 / 30; // Assume 30fps
		const newTime = Math.max(0, Math.min(duration, currentTime + direction * frameTime));
		scrubTime = newTime;
		currentTime = newTime;
		paused = true;
	}

	function handleAnimationEnd() {
		if (cycling && animations.length > 1) {
			animationIndex = (animationIndex + 1) % animations.length;
		} else {
			paused = true;
		}
	}

	function handleTogglePause() {
		if (paused && currentTime >= duration - 0.01) {
			// At end of animation, restart from beginning
			restartTrigger++;
		}
		paused = !paused;
	}

	function handleToggleCycle() {
		cycling = !cycling;
	}

	function takeScreenshot() {
		if (!canvasElement) {
			canvasElement = document.querySelector('canvas');
		}

		if (canvasElement) {
			const link = document.createElement('a');
			link.download = `avatar-screenshot-${Date.now()}.png`;
			link.href = canvasElement.toDataURL('image/png');
			link.click();
		} else {
			console.warn('Canvas not found for screenshot');
		}
	}
</script>

<svelte:head>
	<title>Avatar Photo Room</title>
	<meta name="description" content="3D avatar photo studio for NFT avatars" />
</svelte:head>

<div class="app">
	{#if browser}
		<div class="canvas-container">
			<Canvas>
				<PhotoRoom
					{avatarUrl}
					{animationIndex}
					{paused}
					{scrubTime}
					{restartTrigger}
					{cycling}
					onAnimationsLoaded={handleAnimationsLoaded}
					onSkeletonLoaded={handleSkeletonLoaded}
					onTimeUpdate={handleTimeUpdate}
					onAnimationEnd={handleAnimationEnd}
				/>
			</Canvas>
		</div>
	{/if}

	<ControlPanel
		{avatarUrl}
		onUrlChange={handleUrlChange}
		{isLoading}
		{animations}
		{animationIndex}
		onAnimationChange={handleAnimationChange}
		{hasSkeleton}
	/>

	<SettingsPanel
		onUnequipAll={() => inventory.clearAll()}
		onScreenshot={takeScreenshot}
	/>

	<AnimationTimeline
		{currentTime}
		{duration}
		{paused}
		{cycling}
		onScrub={handleScrub}
		onTogglePause={handleTogglePause}
		onStepFrame={handleStepFrame}
		onToggleCycle={handleToggleCycle}
	/>
</div>

<style>
	.app {
		width: 100vw;
		height: 100vh;
		position: relative;
	}

	.canvas-container {
		width: 100%;
		height: 100%;
	}

	.canvas-container :global(canvas) {
		display: block;
	}
</style>
