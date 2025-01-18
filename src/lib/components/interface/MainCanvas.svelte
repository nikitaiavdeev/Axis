<script lang="ts">
	// Svelte
	import { onMount } from "svelte";

	// Components
	import Grid from "../canvas/Grid.svelte";

	// Runes
	import { myCanvas } from "$lib/runes/canvas.svelte";

	onMount(() => {
		myCanvas.svgInit();
	});
</script>

<svg id="main-canvas" class="h-screen w-screen">
	<Grid></Grid>
	<g id="canvas-content"></g>
</svg>
