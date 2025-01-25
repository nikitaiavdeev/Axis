<script lang="ts">
	// Runes
	import { myCanvas } from "$lib/runes/canvas.svelte";

	const GRID_SIZE = myCanvas.consts.GRID_SIZE;
</script>

<pattern
	id="grid-pattern"
	patternUnits="userSpaceOnUse"
	x={myCanvas.offsetX}
	y={myCanvas.offsetY}
	width={GRID_SIZE * myCanvas.scale}
	height={GRID_SIZE * myCanvas.scale}>
	<line class="major-grid" x1="0" y1="0.5" x2={GRID_SIZE * myCanvas.scale} y2="0.5"></line>
	<line class="major-grid" x1="0.5" y1="0" x2="0.5" y2={GRID_SIZE * myCanvas.scale}></line>

	{#each { length: 4 }, idx}
		<line
			class="minor-grid"
			stroke-dasharray={(GRID_SIZE / 72) * myCanvas.scale}
			x1="0"
			y1={GRID_SIZE * myCanvas.scale * (idx + 1) * 0.2 + 0.5}
			x2={GRID_SIZE * myCanvas.scale}
			y2={GRID_SIZE * myCanvas.scale * (idx + 1) * 0.2 + 0.5}></line>
		<line
			class="minor-grid"
			stroke-dasharray={(GRID_SIZE / 72) * myCanvas.scale}
			x1={GRID_SIZE * myCanvas.scale * (idx + 1) * 0.2 + 0.5}
			y1="0"
			x2={GRID_SIZE * myCanvas.scale * (idx + 1) * 0.2 + 0.5}
			y2={GRID_SIZE * myCanvas.scale}></line>
	{/each}
</pattern>

<g id="grid">
	<rect class="h-screen w-screen" fill="url(#grid-pattern)"></rect>
</g>

<style>
	.major-grid {
		@apply stroke-grid;
	}

	.minor-grid {
		@apply stroke-grid/50;
	}
</style>
