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
	import { Measure } from "./measure/rune.svelte";
	import MeasureSvg from "./measure/MeasureSVG.svelte";
</script>

<svg id="main-canvas" class="h-screen w-screen" role="figure">
	<defs>
		<marker
			id="triangle"
			viewBox="0 0 6 6"
			markerHeight="10"
			markerWidth="10"
			refX="6"
			refY="3"
			fill=" context-stroke"
			orient="auto-start-reverse">
			<path d="M0,0 L0,6 L6,3 Z"></path>
		</marker>

		<filter x="0" y="0" width="1" height="1" id="solid">
			<feFlood flood-color="background" result="bg" />
			<feMerge>
				<feMergeNode in="bg" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>

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

		{#each myCanvas.measures as measure, idx (idx)}
			<MeasureSvg {measure} />
		{/each}

		<!-- Draw edited shape above all -->
		{#if myCanvas.editShape.shape instanceof Rectangle}
			<RectangleSVG shape={myCanvas.editShape.shape} />
		{:else if myCanvas.editShape.shape instanceof Circle}
			<CircleSvg shape={myCanvas.editShape.shape} />
		{:else if myCanvas.editShape.shape instanceof Polygon}
			<PolygonSvg shape={myCanvas.editShape.shape} />
		{:else if myCanvas.editShape.shape instanceof Measure}
			<MeasureSvg measure={myCanvas.editShape.shape} />
		{/if}

		<!-- Draw new shape above all -->
		{#if myCanvas.newShape.shape instanceof Rectangle}
			<RectangleSVG shape={myCanvas.newShape.shape} />
		{:else if myCanvas.newShape.shape instanceof Circle}
			<CircleSvg shape={myCanvas.newShape.shape} />
		{:else if myCanvas.newShape.shape instanceof Polygon}
			<PolygonSvg shape={myCanvas.newShape.shape} />
		{:else if myCanvas.newShape.shape instanceof Measure}
			<MeasureSvg measure={myCanvas.newShape.shape} />
		{/if}
	</g>
</svg>
