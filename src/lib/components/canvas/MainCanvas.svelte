<script lang="ts">
	// Components
	import Grid from "./Grid.svelte";

	// Runes
	import { ui } from "$lib/runes/ui.svelte";
	import { myCanvas } from "$lib/runes/canvas.svelte";

	// Shapes
	import RectangleSVG from "$lib/components/canvas/shapes/Rectangle/RectangleSVG.svelte";
	import { Rectangle } from "$lib/components/canvas/shapes/Rectangle/rune.svelte";
</script>

<svg id="main-canvas" class="h-screen w-screen" role="figure">
	{#if ui.options.showGrid}
		<Grid />
	{/if}
	<g
		id="canvas-content"
		transform="translate({myCanvas.offsetX} {myCanvas.offsetY}) scale({myCanvas.scale})">
		<!-- Draw shapes which aren't holes first -->
		{#each myCanvas.shapes.filter((s) => !s.isHole && s !== myCanvas.editShape.shape) as shape}
			{#if shape instanceof Rectangle}
				<RectangleSVG rect={shape} />
			{/if}
		{/each}

		<!-- Draw shapes which are holes second so they be above -->
		{#each myCanvas.shapes.filter((s) => s.isHole && s !== myCanvas.editShape.shape) as shape}
			{#if shape instanceof Rectangle}
				<RectangleSVG rect={shape} />
			{/if}
		{/each}

		<!-- Draw edited shape above all -->
		{#if myCanvas.editShape.shape instanceof Rectangle}
			<RectangleSVG rect={myCanvas.editShape.shape} />
		{/if}

		<!-- Draw new shape above all -->
		{#if myCanvas.newShape.shape instanceof Rectangle}
			<RectangleSVG rect={myCanvas.newShape.shape} />
		{/if}
	</g>
</svg>
