<script lang="ts">
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Rectangle } from "./rune.svelte";
	import { cn } from "$lib/utils.js";

	let { rect }: { rect: Rectangle } = $props();

	const point1XY = $derived(rect.countourPoints[0].d3Coord),
		point2XY = $derived(rect.countourPoints[1].d3Coord),
		point3XY = $derived(rect.countourPoints[2].d3Coord),
		point4XY = $derived(rect.countourPoints[3].d3Coord),
		pointsXY = $derived([point1XY, point2XY, point3XY, point4XY]);

	const editShape = () => {
		myCanvas.editShape.editShape(rect);
	};
</script>

<path
	class={cn(rect.isHole ? "shape-hole" : "shape", myCanvas.newShape.shape ? "" : "shape-hoverable")}
	d="M{point1XY.x} {point1XY.y} L{point2XY.x} {point2XY.y} L{point3XY.x} {point3XY.y} L{point4XY.x} {point4XY.y} Z"
	onclick={editShape}
	role="none" />

{#if myCanvas.newShape.shape === rect}
	{#each pointsXY as pointXY}
		<circle
			class={rect.isHole ? "point-hole" : "point"}
			cx={pointXY.x}
			cy={pointXY.y}
			r={4 / myCanvas.scale}
			role="none"></circle>
	{/each}
{/if}
