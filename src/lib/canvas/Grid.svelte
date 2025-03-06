<script lang="ts">
	// Runes
	import { myCanvas } from "$lib/runes/canvas.svelte";

	// Constants
	import { GRID_SIZE_PIXELS, GRID_NUMBER_SUBGRIDS } from "$lib/constants.js";
</script>

<pattern
	id="grid-pattern"
	patternUnits="userSpaceOnUse"
	x={myCanvas.offsetX}
	y={myCanvas.offsetY}
	width={GRID_SIZE_PIXELS * myCanvas.scale}
	height={GRID_SIZE_PIXELS * myCanvas.scale}>
	<!-- 0.5 here and below is 0.5 * pixel shift -->
	<line class="stroke-grid" x1="0" y1="0.5" x2={GRID_SIZE_PIXELS * myCanvas.scale} y2="0.5"></line>
	<line class="stroke-grid" x1="0.5" y1="0" x2="0.5" y2={GRID_SIZE_PIXELS * myCanvas.scale}></line>

	{#each { length: GRID_NUMBER_SUBGRIDS - 1 }, idx}
		<line
			class="stroke-grid/50"
			stroke-dasharray={(GRID_SIZE_PIXELS / 72) * myCanvas.scale}
			x1="0"
			y1={(GRID_SIZE_PIXELS * myCanvas.scale * (idx + 1)) / GRID_NUMBER_SUBGRIDS - 0.5}
			x2={GRID_SIZE_PIXELS * myCanvas.scale}
			y2={(GRID_SIZE_PIXELS * myCanvas.scale * (idx + 1)) / GRID_NUMBER_SUBGRIDS - 0.5}>
		</line>
		<line
			class="stroke-grid/50"
			stroke-dasharray={(GRID_SIZE_PIXELS / 72) * myCanvas.scale}
			x1={(GRID_SIZE_PIXELS * myCanvas.scale * (idx + 1)) / GRID_NUMBER_SUBGRIDS - 0.5}
			y1="0"
			x2={(GRID_SIZE_PIXELS * myCanvas.scale * (idx + 1)) / GRID_NUMBER_SUBGRIDS - 0.5}
			y2={GRID_SIZE_PIXELS * myCanvas.scale}>
		</line>
	{/each}
</pattern>

<g id="grid">
	<rect class="h-screen w-screen" fill="url(#grid-pattern)"></rect>
</g>
