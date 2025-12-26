<script lang="ts">
	import { settings } from '$lib/stores/settings.svelte';

	interface Props {
		paused?: boolean;
		onTogglePause?: () => void;
		onUnequipAll?: () => void;
		onScreenshot?: () => void;
	}

	let { paused = false, onTogglePause, onUnequipAll, onScreenshot }: Props = $props();

	let isOpen = $state(false);
</script>

<div class="settings-container">
	<div class="button-row">
		<button class="action-btn" onclick={onScreenshot} title="Take Screenshot">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
				<circle cx="12" cy="13" r="4"/>
				<line x1="12" y1="3" x2="12" y2="5"/>
			</svg>
			<span>Screenshot</span>
		</button>
		<button class="action-btn" onclick={onUnequipAll} title="Unequip All">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
			</svg>
			<span>Unequip</span>
		</button>
		<button class="action-btn" class:active={paused} onclick={onTogglePause} title={paused ? 'Play Animation' : 'Pause Animation'}>
			{#if paused}
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polygon points="5 3 19 12 5 21 5 3"/>
				</svg>
				<span>Play</span>
			{:else}
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<rect x="6" y="4" width="4" height="16"/>
					<rect x="14" y="4" width="4" height="16"/>
				</svg>
				<span>Pause</span>
			{/if}
		</button>
		<button class="action-btn" onclick={() => (isOpen = !isOpen)} title="Settings">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="3"/>
				<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
			</svg>
			<span>Settings</span>
		</button>
	</div>

	{#if isOpen}
		<div class="settings-panel">
			<h3>Settings</h3>
			
			<div class="setting-item">
				<label class="toggle-label">
					<input
						type="checkbox"
						checked={settings.persistInventory}
						onchange={(e) => settings.setPersistInventory(e.currentTarget.checked)}
					/>
					<span class="toggle-text">Persist inventory on avatar change</span>
				</label>
				<p class="setting-description">
					Keep equipped items when loading a new avatar
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.settings-container {
		position: fixed;
		top: 20px;
		right: 20px;
		z-index: 100;
	}

	.button-row {
		display: flex;
		gap: 8px;
	}

	.action-btn {
		padding: 8px 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 10px;
		color: #fff;
		cursor: pointer;
		backdrop-filter: blur(10px);
		transition: background 0.2s;
		font-size: 0.7rem;
	}

	.action-btn:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.action-btn.active {
		background: var(--accent);
		border-color: var(--accent);
	}

	.settings-panel {
		position: absolute;
		top: 54px;
		right: 0;
		width: 280px;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 16px;
		backdrop-filter: blur(10px);
	}

	h3 {
		font-size: 1rem;
		margin: 0 0 16px;
		color: #fff;
	}

	.setting-item {
		margin-bottom: 12px;
	}

	.setting-item:last-child {
		margin-bottom: 0;
	}

	.toggle-label {
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
	}

	.toggle-label input[type="checkbox"] {
		width: 18px;
		height: 18px;
		accent-color: var(--accent);
		cursor: pointer;
	}

	.toggle-text {
		font-size: 0.875rem;
		color: #fff;
	}

	.setting-description {
		font-size: 0.75rem;
		color: #888;
		margin: 6px 0 0 28px;
	}
</style>
