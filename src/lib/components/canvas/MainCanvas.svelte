<script lang="ts">
	// Components
	import Grid from "./Grid.svelte";

	// Runes
	import { ui } from "$lib/runes/ui.svelte";
	import { myCanvas } from "$lib/runes/canvas.svelte";

	// Shapes
	import RectangleSVG from "$lib/components/canvas/shapes/Rectangle/RectangleSVG.svelte";
	import {
		Rectangle,
		ReferencePoint,
	} from "$lib/components/canvas/shapes/Rectangle/rectangleRune.svelte";
</script>

<svg id="main-canvas" class="h-screen w-screen" role="figure">
	{#if ui.options.showGrid}
		<Grid></Grid>
	{/if}
	<g
		id="canvas-content"
		transform="translate({myCanvas.offsetX} {myCanvas.offsetY}) scale({myCanvas.scale})">
		{#each myCanvas.shapes as shape}
			{#if shape instanceof Rectangle}
				<RectangleSVG rect={shape} />
			{/if}
		{/each}

		{#if myCanvas.newShape instanceof Rectangle}
			<RectangleSVG rect={myCanvas.newShape} />
		{/if}
	</g>
</svg>
