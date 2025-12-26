<script lang="ts">
	interface Props {
		avatarUrl: string;
		onUrlChange: (url: string) => void;
		onScreenshot: () => void;
		isLoading?: boolean;
		animations?: string[];
		animationIndex?: number;
		onAnimationChange?: (index: number) => void;
	}

	let {
		avatarUrl,
		onUrlChange,
		onScreenshot,
		isLoading = false,
		animations = [],
		animationIndex = 0,
		onAnimationChange
	}: Props = $props();

	let inputValue = $state(avatarUrl);

	const avatars = [
		{ name: 'Adventurer', path: '/assets/Ultimate Modular Men Pack-glb/Adventurer.glb' },
		{ name: 'Astronaut', path: '/assets/Ultimate Modular Men Pack-glb/Astronaut.glb' },
		{ name: 'Business Man', path: '/assets/Ultimate Modular Men Pack-glb/Business Man.glb' },
		{ name: 'Casual', path: '/assets/Ultimate Modular Men Pack-glb/Casual Character.glb' },
		{ name: 'Hoodie', path: '/assets/Ultimate Modular Men Pack-glb/Hoodie Character.glb' },
		{ name: 'King', path: '/assets/Ultimate Modular Men Pack-glb/King.glb' },
		{ name: 'Punk', path: '/assets/Ultimate Modular Men Pack-glb/Punk.glb' },
		{ name: 'Swat', path: '/assets/Ultimate Modular Men Pack-glb/Swat.glb' },
		{ name: 'Worker', path: '/assets/Ultimate Modular Men Pack-glb/Worker.glb' },
		{ name: 'Farmer', path: '/assets/Ultimate Modular Men Pack-glb/Farmer.glb' },
		{ name: 'Beach', path: '/assets/Ultimate Modular Men Pack-glb/Beach Character.glb' },
	];

	const items = [
		{ name: 'Sword', path: '/assets/Ultimate RPG Items Bundle-glb/Sword.glb' },
		{ name: 'Claymore', path: '/assets/Ultimate RPG Items Bundle-glb/Claymore.glb' },
		{ name: 'Shield', path: '/assets/Ultimate RPG Items Bundle-glb/Shield Round.glb' },
		{ name: 'Spear', path: '/assets/Ultimate RPG Items Bundle-glb/Spear.glb' },
		{ name: 'Knife', path: '/assets/Ultimate RPG Items Bundle-glb/Knife.glb' },
	];

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			onUrlChange(inputValue);
		}
	}
</script>

<div class="panel">
	<h1>Avatar Photo Room</h1>

	<div class="section">
		<label for="avatar-url">GLB/GLTF URL</label>
		<div class="input-group">
			<input
				id="avatar-url"
				type="text"
				bind:value={inputValue}
				onkeydown={handleKeydown}
				placeholder="https://example.com/avatar.glb"
			/>
			<button onclick={() => onUrlChange(inputValue)} disabled={isLoading}>
				{isLoading ? 'Loading...' : 'Load'}
			</button>
		</div>
	</div>

	<div class="section">
		<label>Avatars</label>
		<div class="samples">
			{#each avatars as avatar}
				<button class="sample" onclick={() => onUrlChange(avatar.path)}>
					{avatar.name}
				</button>
			{/each}
		</div>
	</div>

	<div class="section">
		<label>Items</label>
		<div class="samples">
			{#each items as item}
				<button class="sample" onclick={() => onUrlChange(item.path)}>
					{item.name}
				</button>
			{/each}
		</div>
	</div>

	{#if animations.length > 0}
		<div class="section">
			<label>Animations ({animations.length})</label>
			<div class="animations">
				{#each animations as anim, i}
					<button
						class="anim-btn"
						class:active={animationIndex === i}
						onclick={() => onAnimationChange?.(i)}
					>
						{anim}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<div class="section">
		<button class="screenshot-btn" onclick={onScreenshot}>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
				<circle cx="12" cy="13" r="4"/>
				<line x1="12" y1="3" x2="12" y2="5"/>
			</svg>
			Take Screenshot
		</button>
	</div>

	<div class="instructions">
		<p><strong>Controls:</strong></p>
		<ul>
			<li>Left click + drag to rotate</li>
			<li>Right click + drag to pan</li>
			<li>Scroll to zoom</li>
		</ul>
	</div>
</div>

<style>
	.panel {
		position: fixed;
		top: 20px;
		left: 20px;
		width: 320px;
		max-height: calc(100vh - 40px);
		overflow-y: auto;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 20px;
		backdrop-filter: blur(10px);
		z-index: 100;
	}

	h1 {
		font-size: 1.25rem;
		margin-bottom: 20px;
		color: #fff;
	}

	.section {
		margin-bottom: 16px;
	}

	label {
		display: block;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #888;
		margin-bottom: 8px;
	}

	.input-group {
		display: flex;
		gap: 8px;
	}

	input {
		flex: 1;
		padding: 10px 12px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid var(--border);
		border-radius: 8px;
		color: #fff;
		font-size: 0.875rem;
	}

	input:focus {
		outline: none;
		border-color: var(--accent);
	}

	button {
		padding: 10px 16px;
		background: var(--accent);
		border: none;
		border-radius: 8px;
		color: #fff;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s;
	}

	button:hover:not(:disabled) {
		background: var(--accent-hover);
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.samples {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.sample {
		padding: 6px 12px;
		font-size: 0.75rem;
		background: rgba(255, 255, 255, 0.1);
	}

	.sample:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.animations {
		display: flex;
		flex-direction: column;
		gap: 4px;
		max-height: 200px;
		overflow-y: auto;
	}

	.anim-btn {
		padding: 10px 12px;
		font-size: 0.8rem;
		background: rgba(255, 255, 255, 0.1);
		text-align: left;
		white-space: normal;
		word-break: break-word;
		line-height: 1.3;
	}

	.anim-btn:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.anim-btn.active {
		background: var(--accent);
	}

	.screenshot-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px;
	}

	.instructions {
		margin-top: 20px;
		padding-top: 16px;
		border-top: 1px solid var(--border);
		font-size: 0.75rem;
		color: #666;
	}

	.instructions p {
		margin-bottom: 8px;
	}

	.instructions ul {
		list-style: none;
		padding-left: 0;
	}

	.instructions li {
		margin-bottom: 4px;
	}
</style>
