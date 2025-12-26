<script lang="ts">
	import { inventory, ITEM_CATALOG, type ItemDefinition } from '$lib/stores/inventory.svelte';

	interface Props {
		avatarUrl: string;
		onUrlChange: (url: string) => void;
		onScreenshot: () => void;
		isLoading?: boolean;
		animations?: string[];
		animationIndex?: number;
		onAnimationChange?: (index: number) => void;
		hasSkeleton?: boolean;
	}

	let {
		avatarUrl,
		onUrlChange,
		onScreenshot,
		isLoading = false,
		animations = [],
		animationIndex = 0,
		onAnimationChange,
		hasSkeleton = false
	}: Props = $props();

	let inputValue = $state(avatarUrl);

	// Rotation offsets in degrees for UI, will be converted to radians
	let rotationX = $state(0);
	let rotationY = $state(0);
	let rotationZ = $state(0);

	// Position offsets
	let positionX = $state(0);
	let positionY = $state(0);
	let positionZ = $state(0);

	// Scale
	let scaleValue = $state(0.01);

	// Update inventory rotation when sliders change
	$effect(() => {
		const radX = (rotationX * Math.PI) / 180;
		const radY = (rotationY * Math.PI) / 180;
		const radZ = (rotationZ * Math.PI) / 180;
		inventory.setRotationOverride([radX, radY, radZ]);
	});

	// Update inventory position when sliders change
	$effect(() => {
		inventory.setPositionOverride([positionX, positionY, positionZ]);
	});

	// Update inventory scale when slider changes
	$effect(() => {
		inventory.setScaleOverride(scaleValue);
	});

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

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			onUrlChange(inputValue);
		}
	}

	function toggleEquip(item: ItemDefinition) {
		if (inventory.isEquipped(item)) {
			inventory.unequip(item.slot);
		} else {
			inventory.equip(item);
		}
	}

	// Get slot display name
	function getSlotName(slot: string): string {
		const names: Record<string, string> = {
			mainHand: 'Main Hand',
			offHand: 'Off Hand',
			back: 'Back'
		};
		return names[slot] || slot;
	}

	function resetRotation() {
		rotationX = 0;
		rotationY = 0;
		rotationZ = 0;
	}

	function resetPosition() {
		positionX = 0;
		positionY = 0;
		positionZ = 0;
	}

	function resetScale() {
		scaleValue = 0.01;
	}

	function resetAll() {
		resetRotation();
		resetPosition();
		resetScale();
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
		<label>Equipment {hasSkeleton ? '' : '(Load an avatar first)'}</label>
		{#if hasSkeleton}
			<div class="equipment-grid">
				{#each ITEM_CATALOG as item}
					{@const isEquipped = inventory.isEquipped(item)}
					<button
						class="equipment-item"
						class:equipped={isEquipped}
						onclick={() => toggleEquip(item)}
						title={`${item.name} - ${getSlotName(item.slot)}`}
					>
						<span class="item-name">{item.name}</span>
						<span class="item-slot">{getSlotName(item.slot)}</span>
						{#if isEquipped}
							<span class="equipped-badge">Equipped</span>
						{/if}
					</button>
				{/each}
			</div>
			<div class="equipped-summary">
				<strong>Equipped:</strong>
				{#if inventory.equipped.mainHand || inventory.equipped.offHand || inventory.equipped.back}
					<ul>
						{#if inventory.equipped.mainHand}
							<li>Main Hand: {inventory.equipped.mainHand.name}</li>
						{/if}
						{#if inventory.equipped.offHand}
							<li>Off Hand: {inventory.equipped.offHand.name}</li>
						{/if}
						{#if inventory.equipped.back}
							<li>Back: {inventory.equipped.back.name}</li>
						{/if}
					</ul>
				{:else}
					<span class="no-items">No items equipped</span>
				{/if}
			</div>

			{#if inventory.equipped.mainHand || inventory.equipped.offHand || inventory.equipped.back}
				<div class="transform-controls">
					<div class="controls-header">
						<strong>Transform Offset</strong>
						<button class="reset-btn" onclick={resetAll}>Reset All</button>
					</div>

					<div class="control-group">
						<div class="control-group-header">
							<span>Position</span>
							<button class="reset-btn small" onclick={resetPosition}>Reset</button>
						</div>
						<div class="slider-row">
							<span class="slider-label">X</span>
							<input type="range" min="-0.5" max="0.5" step="0.001" bind:value={positionX} />
							<span class="slider-value">{positionX.toFixed(3)}</span>
						</div>
						<div class="slider-row">
							<span class="slider-label">Y</span>
							<input type="range" min="-0.5" max="0.5" step="0.001" bind:value={positionY} />
							<span class="slider-value">{positionY.toFixed(3)}</span>
						</div>
						<div class="slider-row">
							<span class="slider-label">Z</span>
							<input type="range" min="-0.5" max="0.5" step="0.001" bind:value={positionZ} />
							<span class="slider-value">{positionZ.toFixed(3)}</span>
						</div>
					</div>

					<div class="control-group">
						<div class="control-group-header">
							<span>Rotation</span>
							<button class="reset-btn small" onclick={resetRotation}>Reset</button>
						</div>
						<div class="slider-row">
							<span class="slider-label">X</span>
							<input type="range" min="-180" max="180" step="1" bind:value={rotationX} />
							<span class="slider-value">{rotationX}°</span>
						</div>
						<div class="slider-row">
							<span class="slider-label">Y</span>
							<input type="range" min="-180" max="180" step="1" bind:value={rotationY} />
							<span class="slider-value">{rotationY}°</span>
						</div>
						<div class="slider-row">
							<span class="slider-label">Z</span>
							<input type="range" min="-180" max="180" step="1" bind:value={rotationZ} />
							<span class="slider-value">{rotationZ}°</span>
						</div>
					</div>

					<div class="control-group">
						<div class="control-group-header">
							<span>Scale</span>
							<button class="reset-btn small" onclick={resetScale}>Reset</button>
						</div>
						<div class="slider-row">
							<span class="slider-label"></span>
							<input type="range" min="0.0001" max="0.1" step="0.0001" bind:value={scaleValue} />
							<span class="slider-value">{scaleValue.toFixed(4)}</span>
						</div>
					</div>

					<div class="transform-output">
						<div class="output-row">
							<span>pos:</span>
							<code>[{positionX.toFixed(3)}, {positionY.toFixed(3)}, {positionZ.toFixed(3)}]</code>
						</div>
						<div class="output-row">
							<span>rot:</span>
							<code>[{((rotationX * Math.PI) / 180).toFixed(3)}, {((rotationY * Math.PI) / 180).toFixed(3)}, {((rotationZ * Math.PI) / 180).toFixed(3)}]</code>
						</div>
						<div class="output-row">
							<span>scale:</span>
							<code>{scaleValue.toFixed(4)}</code>
						</div>
					</div>
				</div>
			{/if}
		{:else}
			<p class="no-skeleton-hint">Load an avatar with a skeleton to equip items</p>
		{/if}
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

	.equipment-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
		margin-bottom: 12px;
	}

	.equipment-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 10px 12px;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid transparent;
		text-align: left;
		position: relative;
	}

	.equipment-item:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.equipment-item.equipped {
		background: rgba(99, 102, 241, 0.3);
		border-color: var(--accent);
	}

	.item-name {
		font-weight: 500;
		font-size: 0.85rem;
	}

	.item-slot {
		font-size: 0.7rem;
		color: #888;
		margin-top: 2px;
	}

	.equipped-badge {
		position: absolute;
		top: 4px;
		right: 4px;
		font-size: 0.6rem;
		background: var(--accent);
		padding: 2px 6px;
		border-radius: 4px;
		text-transform: uppercase;
	}

	.equipped-summary {
		font-size: 0.8rem;
		padding: 10px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 6px;
	}

	.equipped-summary ul {
		list-style: none;
		padding-left: 0;
		margin: 8px 0 0;
	}

	.equipped-summary li {
		margin-bottom: 4px;
		color: #aaa;
	}

	.no-items {
		color: #666;
		font-style: italic;
		display: block;
		margin-top: 4px;
	}

	.no-skeleton-hint {
		color: #666;
		font-size: 0.8rem;
		font-style: italic;
		margin: 0;
	}

	.transform-controls {
		margin-top: 12px;
		padding: 12px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
	}

	.controls-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}

	.control-group {
		margin-bottom: 12px;
	}

	.control-group-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 6px;
		font-size: 0.75rem;
		color: #888;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.reset-btn {
		padding: 4px 10px;
		font-size: 0.7rem;
		background: rgba(255, 255, 255, 0.1);
	}

	.reset-btn.small {
		padding: 2px 6px;
		font-size: 0.6rem;
	}

	.slider-row {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 6px;
	}

	.slider-label {
		width: 16px;
		font-size: 0.8rem;
		font-weight: 600;
		color: #888;
	}

	.slider-row input[type="range"] {
		flex: 1;
		height: 4px;
		-webkit-appearance: none;
		appearance: none;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 2px;
		cursor: pointer;
	}

	.slider-row input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 14px;
		height: 14px;
		background: var(--accent);
		border-radius: 50%;
		cursor: pointer;
	}

	.slider-value {
		width: 45px;
		font-size: 0.75rem;
		text-align: right;
		color: #aaa;
	}

	.transform-output {
		margin-top: 8px;
		padding: 8px;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 4px;
		font-size: 0.7rem;
	}

	.output-row {
		display: flex;
		gap: 8px;
		margin-bottom: 4px;
	}

	.output-row:last-child {
		margin-bottom: 0;
	}

	.output-row span {
		color: #888;
		width: 28px;
	}

	.output-row code {
		color: #7dd3fc;
		font-family: monospace;
	}
</style>
