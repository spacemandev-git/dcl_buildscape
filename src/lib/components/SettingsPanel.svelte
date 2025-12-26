<script lang="ts">
	import { settings } from '$lib/stores/settings.svelte';

	let isOpen = $state(false);
</script>

<div class="settings-container">
	<button class="settings-toggle" onclick={() => (isOpen = !isOpen)} title="Settings">
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<circle cx="12" cy="12" r="3"/>
			<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
		</svg>
	</button>

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

	.settings-toggle {
		width: 44px;
		height: 44px;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--panel-bg);
		border: 1px solid var(--border);
		border-radius: 10px;
		color: #fff;
		cursor: pointer;
		backdrop-filter: blur(10px);
		transition: background 0.2s;
	}

	.settings-toggle:hover {
		background: rgba(255, 255, 255, 0.15);
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
