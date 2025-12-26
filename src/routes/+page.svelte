<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { browser } from '$app/environment';
	import PhotoRoom from '$lib/components/PhotoRoom.svelte';
	import ControlPanel from '$lib/components/ControlPanel.svelte';

	let avatarUrl = $state('');
	let isLoading = $state(false);
	let canvasElement: HTMLCanvasElement | null = $state(null);
	let animations = $state<string[]>([]);
	let animationIndex = $state(0);

	function handleUrlChange(url: string) {
		if (!url.trim()) return;
		isLoading = true;
		avatarUrl = url.trim();
		animations = [];
		animationIndex = 0;
		setTimeout(() => {
			isLoading = false;
		}, 2000);
	}

	function handleAnimationsLoaded(names: string[]) {
		animations = names;
	}

	function handleAnimationChange(index: number) {
		animationIndex = index;
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
					onAnimationsLoaded={handleAnimationsLoaded}
				/>
			</Canvas>
		</div>
	{/if}

	<ControlPanel
		{avatarUrl}
		onUrlChange={handleUrlChange}
		onScreenshot={takeScreenshot}
		{isLoading}
		{animations}
		{animationIndex}
		onAnimationChange={handleAnimationChange}
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
