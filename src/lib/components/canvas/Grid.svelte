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
	height={GRID_SIZE * myCanvas.scale}
	opacity={Math.min(myCanvas.scale, 1)}>
	<line class="stroke-border" x1="0" y1="0" x2={GRID_SIZE * myCanvas.scale} y2="0"></line>
	<line class="stroke-border" x1="0" y1="0" x2="0" y2={GRID_SIZE * myCanvas.scale}></line>
</pattern>

<g id="grid">
	<rect class="h-screen w-screen" fill="url(#grid-pattern)"></rect>
</g>
