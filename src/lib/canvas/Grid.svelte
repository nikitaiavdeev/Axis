<script lang="ts">
	// Runes
	import { myCanvas } from "$lib/runes/canvas.svelte";

	// Constants
	import { GRID_SIZE_PIXELS, GRID_NUMBER_SUBGRIDS } from "$lib/constants.js";

	const widthNumOfMajorGrids = $derived(
			Math.ceil(myCanvas.size.width / myCanvas.scaledGridSize) + 1
		),
		heightNumOfMajorGrids = $derived(Math.ceil(myCanvas.size.height / myCanvas.scaledGridSize) + 1),
		scaledMinorGridSize = $derived(myCanvas.scaledGridSize / GRID_NUMBER_SUBGRIDS),
		scaledDashSize = $derived((GRID_SIZE_PIXELS / 72) * myCanvas.scale);
</script>

<g id="grid">
	{#each { length: heightNumOfMajorGrids }, hIdx (hIdx)}
		<!-- Major Horizontal Grid -->
		<line
			class="stroke-border"
			vector-effect="non-scaling-stroke"
			shape-rendering="crispEdges"
			x1={0}
			y1={(myCanvas.offsetY % myCanvas.scaledGridSize) + hIdx * myCanvas.scaledGridSize}
			x2={myCanvas.size.width}
			y2={(myCanvas.offsetY % myCanvas.scaledGridSize) + hIdx * myCanvas.scaledGridSize}>
		</line>

		<!-- Minor Horizontal Grid -->
		{#each { length: GRID_NUMBER_SUBGRIDS - 1 }, sIdx (sIdx)}
			<line
				class="stroke-border/75"
				vector-effect="non-scaling-stroke"
				shape-rendering="crispEdges"
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

	<!-- Major Vertical Grid -->
	{#each { length: widthNumOfMajorGrids }, wIdx (wIdx)}
		<line
			class="stroke-border"
			vector-effect="non-scaling-stroke"
			shape-rendering="crispEdges"
			x1={(myCanvas.offsetX % myCanvas.scaledGridSize) + wIdx * myCanvas.scaledGridSize}
			y1={0}
			x2={(myCanvas.offsetX % myCanvas.scaledGridSize) + wIdx * myCanvas.scaledGridSize}
			y2={myCanvas.size.height}>
		</line>

		<!-- Minor Vertical Grid -->
		{#each { length: GRID_NUMBER_SUBGRIDS - 1 }, sIdx (sIdx)}
			<line
				class="stroke-border/75"
				vector-effect="non-scaling-stroke"
				shape-rendering="crispEdges"
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
