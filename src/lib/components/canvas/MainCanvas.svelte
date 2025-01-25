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
		<Grid ></Grid>
	{/if}
	<g
		id="canvas-content"
		>
		<!-- <circle cx="768" cy="412.8" r="25" fill="white"></circle> -->

		<RectangleSVG rect={new Rectangle()} />
	</g>
</svg>
