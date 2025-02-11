<script lang="ts">
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { ui } from "$lib/runes/ui.svelte";
	import { Polygon } from "./rune.svelte";

	let { shape }: { shape: Polygon } = $props();

	const pathString = $derived.by(() => {
		let pathStr = "";

		for (let idx = 0; idx < shape.points.length; idx++) {
			const d3Coord = shape.points[idx].d3Coord;
			pathStr += `${idx === 0 ? "M" : "L"}${d3Coord.x},${d3Coord.y}`;
		}
		pathStr += "Z";

		return pathStr;
	});
</script>

<g
	class:hole={shape.isHole}
	class:hoverable={myCanvas.newShape.shape === undefined && !ui.mouse.down}
	class:selected={myCanvas.editShape.shape === shape}
	class:move={myCanvas.editShape.shape === shape && ui.options.editMode === "move"}
	class:resize={myCanvas.editShape.shape === shape && ui.options.editMode === "resize"}>
	<path class="shape" d={pathString} role="none" />

	{#if myCanvas.editShape.shape === shape && ui.options.editMode === "resize"}
		{#each Object.entries(shape.points) as [pointName, point] (pointName)}
			<rect
				class="point {pointName}"
				x={point.d3Coord.x - 5 / myCanvas.scale}
				y={point.d3Coord.y - 5 / myCanvas.scale}
				width={10 / myCanvas.scale}
				height={10 / myCanvas.scale}
				role="none">
			</rect>
		{/each}
	{:else if myCanvas.newShape.shape === shape || myCanvas.editShape.shape === shape}
		{#each Object.entries(shape.points) as [pointName, point] (pointName)}
			<circle
				class="point"
				cx={point.d3Coord.x}
				cy={point.d3Coord.y}
				r={5 / myCanvas.scale}
				role="none">
			</circle>
		{/each}
	{/if}
</g>
