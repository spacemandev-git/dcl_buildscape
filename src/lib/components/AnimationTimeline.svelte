<script lang="ts">
	interface Props {
		currentTime: number;
		duration: number;
		paused: boolean;
		cycling: boolean;
		onScrub: (time: number | null) => void;
		onTogglePause: () => void;
		onStepFrame: (direction: -1 | 1) => void;
		onToggleCycle: () => void;
	}

	let { currentTime, duration, paused, cycling, onScrub, onTogglePause, onStepFrame, onToggleCycle }: Props = $props();

	let isScrubbing = $state(false);
	let sliderValue = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		const ms = Math.floor((seconds % 1) * 100);
		return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
	}

	function handleSliderInput(e: Event) {
		const value = (e.target as HTMLInputElement).valueAsNumber;
		const time = (value / 100) * duration;
		onScrub(time);
	}

	function handleSliderStart() {
		isScrubbing = true;
	}

	function handleSliderEnd() {
		isScrubbing = false;
		onScrub(null);
	}
</script>

{#if duration > 0}
	<div class="timeline-container">
		<div class="timeline-controls">
			<button class="timeline-btn" onclick={() => onStepFrame(-1)} title="Previous Frame">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polygon points="19 20 9 12 19 4 19 20"/>
					<line x1="5" y1="19" x2="5" y2="5"/>
				</svg>
			</button>

			<button class="timeline-btn play-btn" onclick={onTogglePause} title={paused ? 'Play' : 'Pause'}>
				{#if paused}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
						<polygon points="5 3 19 12 5 21 5 3"/>
					</svg>
				{:else}
					<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
						<rect x="6" y="4" width="4" height="16"/>
						<rect x="14" y="4" width="4" height="16"/>
					</svg>
				{/if}
			</button>

			<button class="timeline-btn" onclick={() => onStepFrame(1)} title="Next Frame">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polygon points="5 4 15 12 5 20 5 4"/>
					<line x1="19" y1="5" x2="19" y2="19"/>
				</svg>
			</button>

			<div class="separator"></div>

			<button class="timeline-btn" class:active={cycling} onclick={onToggleCycle} title="Cycle All Animations">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polygon points="5 3 19 12 5 21 5 3"/>
					<line x1="19" y1="3" x2="19" y2="21"/>
				</svg>
				<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="position: absolute; right: 2px; bottom: 2px;">
					<polyline points="17 1 21 5 17 9"/>
					<path d="M3 11V9a4 4 0 0 1 4-4h14"/>
				</svg>
			</button>
		</div>

		<div class="timeline-slider">
			<span class="time-display">{formatTime(currentTime)}</span>
			<input
				type="range"
				min="0"
				max="100"
				step="0.1"
				value={sliderValue}
				oninput={handleSliderInput}
				onmousedown={handleSliderStart}
				onmouseup={handleSliderEnd}
				ontouchstart={handleSliderStart}
				ontouchend={handleSliderEnd}
			/>
			<span class="time-display">{formatTime(duration)}</span>
		</div>
	</div>
{/if}

<style>
	.timeline-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 12px 20px;
		background: var(--panel-bg);
		border-top: 1px solid var(--border);
		backdrop-filter: blur(10px);
		z-index: 100;
	}

	.timeline-controls {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.timeline-btn {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid var(--border);
		border-radius: 8px;
		color: #fff;
		cursor: pointer;
		transition: background 0.2s;
	}

	.timeline-btn:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.timeline-btn.active {
		background: var(--accent);
		border-color: var(--accent);
	}

	.timeline-btn {
		position: relative;
	}

	.separator {
		width: 1px;
		height: 24px;
		background: var(--border);
		margin: 0 4px;
	}

	.play-btn {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: var(--accent);
		border-color: var(--accent);
	}

	.play-btn:hover {
		background: var(--accent-hover, #7c3aed);
	}

	.timeline-slider {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.time-display {
		font-family: monospace;
		font-size: 0.8rem;
		color: #888;
		min-width: 70px;
	}

	.time-display:last-child {
		text-align: right;
	}

	input[type="range"] {
		flex: 1;
		height: 6px;
		-webkit-appearance: none;
		appearance: none;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 3px;
		cursor: pointer;
	}

	input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		background: var(--accent);
		border-radius: 50%;
		cursor: grab;
		transition: transform 0.1s;
	}

	input[type="range"]::-webkit-slider-thumb:hover {
		transform: scale(1.2);
	}

	input[type="range"]::-webkit-slider-thumb:active {
		cursor: grabbing;
	}

	input[type="range"]::-moz-range-thumb {
		width: 16px;
		height: 16px;
		background: var(--accent);
		border: none;
		border-radius: 50%;
		cursor: grab;
	}
</style>
