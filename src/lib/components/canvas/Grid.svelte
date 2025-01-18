<script lang="ts">
	// Runes
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { ui } from "$lib/runes/ui.svelte";

	const GRID_SIZE = myCanvas.consts.GRID_SIZE,
		position = ui.options.position;
</script>

<pattern
	id="grid-pattern"
	patternUnits="userSpaceOnUse"
	x={position.x}
	y={position.y}
	width={GRID_SIZE * position.zoom}
	height={GRID_SIZE * position.zoom}
	opacity={Math.min(position.zoom, 1)}>
	<line class="stroke-border" x1="0" y1="0" x2={GRID_SIZE * 16} y2="0"></line>
	<line class="stroke-border" x1="0" y1="0" x2="0" y2={GRID_SIZE * 16}></line>
</pattern>

<g id="grid">
	<rect class="h-screen w-screen" fill="url(#grid-pattern)"></rect>
</g>
