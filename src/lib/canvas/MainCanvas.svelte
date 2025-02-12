<script lang="ts">
	// Components
	import Grid from "./Grid.svelte";

	// Runes
	import { ui } from "$lib/runes/ui.svelte";
	import { myCanvas } from "$lib/runes/canvas.svelte";

	// Shapes
	import RectangleSVG from "$lib/canvas/shapes/Rectangle/RectangleSVG.svelte";
	import { Rectangle } from "$lib/canvas/shapes/Rectangle/rune.svelte";
	import { Circle } from "$lib/canvas/shapes/Circle/rune.svelte";
	import CircleSvg from "./shapes/Circle/CircleSVG.svelte";
	import { Polygon } from "./shapes/Polygon/rune.svelte";
	import PolygonSvg from "./shapes/Polygon/PolygonSVG.svelte";
</script>

<svg id="main-canvas" class="h-screen w-screen" role="figure">
	{#if ui.options.showGrid}
		<Grid />
	{/if}
	<g
		id="canvas-content"
		transform="translate({myCanvas.offsetX} {myCanvas.offsetY}) scale({myCanvas.scale})">
		<!-- Draw shapes which aren't holes first -->
		{#each myCanvas.shapes.filter((s) => !s.isHole && s !== myCanvas.editShape.shape) as shape, idx (idx)}
			{#if shape instanceof Rectangle}
				<RectangleSVG {shape} />
			{:else if shape instanceof Circle}
				<CircleSvg {shape} />
			{:else if shape instanceof Polygon}
				<PolygonSvg {shape} />
			{/if}
		{/each}

		<!-- Draw shapes which are holes second so they be above -->
		{#each myCanvas.shapes.filter((s) => s.isHole && s !== myCanvas.editShape.shape) as shape, idx (idx)}
			{#if shape instanceof Rectangle}
				<RectangleSVG {shape} />
			{:else if shape instanceof Circle}
				<CircleSvg {shape} />
			{:else if shape instanceof Polygon}
				<PolygonSvg {shape} />
			{/if}
		{/each}

		<!-- Draw edited shape above all -->
		{#if myCanvas.editShape.shape instanceof Rectangle}
			<RectangleSVG shape={myCanvas.editShape.shape} />
		{:else if myCanvas.editShape.shape instanceof Circle}
			<CircleSvg shape={myCanvas.editShape.shape} />
		{:else if myCanvas.editShape.shape instanceof Polygon}
			<PolygonSvg shape={myCanvas.editShape.shape} />
		{/if}

		<!-- Draw new shape above all -->
		{#if myCanvas.newShape.shape instanceof Rectangle}
			<RectangleSVG shape={myCanvas.newShape.shape} />
		{:else if myCanvas.newShape.shape instanceof Circle}
			<CircleSvg shape={myCanvas.newShape.shape} />
		{:else if myCanvas.newShape.shape instanceof Polygon}
			<PolygonSvg shape={myCanvas.newShape.shape} />
		{/if}
	</g>
</svg>
