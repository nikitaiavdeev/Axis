<script lang="ts">
	// Import the main canvas store (manages state for the canvas)
	import { myCanvas } from "$lib/runes/canvas.svelte";

	// Import grid constants
	import { GRID_SIZE_PIXELS, GRID_NUMBER_SUBGRIDS } from "$lib/constants.js";

	// Calculate the number of major grid lines needed horizontally and vertically
	const widthNumOfMajorGrids = $derived(
			Math.ceil(myCanvas.size.width / myCanvas.scaledGridSize) + 1
		),
		heightNumOfMajorGrids = $derived(Math.ceil(myCanvas.size.height / myCanvas.scaledGridSize) + 1),
		// Calculate the size of a minor grid (subgrid) cell
		scaledMinorGridSize = $derived(myCanvas.scaledGridSize / GRID_NUMBER_SUBGRIDS),
		// Calculate the dash size for minor grid lines (for dashed appearance)
		scaledDashSize = $derived((GRID_SIZE_PIXELS / 72) * myCanvas.scale);
</script>

<g id="grid">
	<!-- Transparent rectangle to catch clicks outside of shapes and clear selection -->
	<rect
		class="h-screen w-screen fill-transparent stroke-none"
		onclick={() => {
			// Deselect any selected shape when clicking on the grid background
			if (myCanvas.editShape) {
				myCanvas.editShape = undefined;
			}
		}}
		role="none">
	</rect>

	<!-- Render major and minor horizontal grid lines -->
	{#each { length: heightNumOfMajorGrids }, hIdx (hIdx)}
		<!-- Major Horizontal Grid Line -->
		<line
			class="stroke-muted-foreground/50"
			vector-effect="non-scaling-stroke"
			x1={0}
			y1={(myCanvas.offsetY % myCanvas.scaledGridSize) + hIdx * myCanvas.scaledGridSize}
			x2={myCanvas.size.width}
			y2={(myCanvas.offsetY % myCanvas.scaledGridSize) + hIdx * myCanvas.scaledGridSize}>
		</line>

		<!-- Minor Horizontal Grid Lines (subdivisions between major lines) -->
		{#each { length: GRID_NUMBER_SUBGRIDS - 1 }, sIdx (sIdx)}
			<line
				class="stroke-muted-foreground/25"
				vector-effect="non-scaling-stroke"
				stroke-dasharray={scaledDashSize}
				stroke-dashoffset={-myCanvas.offsetX}
				x1={0}
				y1={(myCanvas.offsetY % myCanvas.scaledGridSize) +
					(hIdx - 1) * myCanvas.scaledGridSize +
					(sIdx + 1) * scaledMinorGridSize}
				x2={myCanvas.size.width}
				y2={(myCanvas.offsetY % myCanvas.scaledGridSize) +
					(hIdx - 1) * myCanvas.scaledGridSize +
					(sIdx + 1) * scaledMinorGridSize}>
			</line>
		{/each}
	{/each}

	<!-- Render major and minor vertical grid lines -->
	{#each { length: widthNumOfMajorGrids }, wIdx (wIdx)}
		<!-- Major Vertical Grid Line -->
		<line
			class="stroke-muted-foreground/50"
			vector-effect="non-scaling-stroke"
			x1={(myCanvas.offsetX % myCanvas.scaledGridSize) + wIdx * myCanvas.scaledGridSize}
			y1={0}
			x2={(myCanvas.offsetX % myCanvas.scaledGridSize) + wIdx * myCanvas.scaledGridSize}
			y2={myCanvas.size.height}>
		</line>

		<!-- Minor Vertical Grid Lines (subdivisions between major lines) -->
		{#each { length: GRID_NUMBER_SUBGRIDS - 1 }, sIdx (sIdx)}
			<line
				class="stroke-muted-foreground/25"
				vector-effect="non-scaling-stroke"
				stroke-dasharray={scaledDashSize}
				stroke-dashoffset={-myCanvas.offsetY}
				x1={(myCanvas.offsetX % myCanvas.scaledGridSize) +
					(wIdx - 1) * myCanvas.scaledGridSize +
					(sIdx + 1) * scaledMinorGridSize}
				y1={0}
				x2={(myCanvas.offsetX % myCanvas.scaledGridSize) +
					(wIdx - 1) * myCanvas.scaledGridSize +
					(sIdx + 1) * scaledMinorGridSize}
				y2={myCanvas.size.height}>
			</line>
		{/each}
	{/each}
</g>
