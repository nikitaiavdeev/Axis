<script lang="ts">
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Polygon } from "./rune.svelte";

	let { shape }: { shape: Polygon } = $props();

	let editedPointID = $state(0);

	$effect(() => {
		if (myCanvas.activeElement === shape && myCanvas.mouse.down && editedPointID) {
			if (myCanvas.activeElementMode === "move") {
				shape.points[editedPointID].xMove(myCanvas.mouse.x);
				shape.points[editedPointID].yMove(myCanvas.mouse.y);
			} else {
				shape.points[editedPointID].xResize(myCanvas.mouse.x);
				shape.points[editedPointID].yResize(myCanvas.mouse.y);
			}
		}
	});

	const pathString = $derived.by(() => {
		let pathStr = "";

		for (const point of shape.points) {
			pathStr += `${pathStr === "" ? "M" : "L"}${point.d3Coord.x},${point.d3Coord.y}`;
		}
		pathStr += "Z";

		return pathStr;
	});

	const editShape = () => {
		const { activeElement, activeElementMode, uiOptions } = myCanvas;

		// Ignore click if new shape is creating
		if (activeElementMode === "new") return;

		// Togle mode if shape already selected
		if (activeElement === shape) {
			uiOptions.editMode = uiOptions.editMode === "move" ? "resize" : "move";
		} else if (activeElement === undefined) {
			myCanvas.activeElement = shape;
		}
		myCanvas.activeElementMode = myCanvas.uiOptions.editMode;
	};
	const startMove = (pointIdx: number) => {
		editedPointID = pointIdx;
		myCanvas.mouse.down = true;
	};
</script>

<g
	class:hole={shape.isHole}
	class:hoverable={myCanvas.activeElement === undefined && !myCanvas.mouse.down}
	class:selected={myCanvas.activeElement === shape}
	class:move={myCanvas.activeElement === shape && myCanvas.uiOptions.editMode === "move"}
	class:resize={myCanvas.activeElement === shape && myCanvas.uiOptions.editMode === "resize"}>
	<path class="shape" d={pathString} role="none" onclick={editShape} fill="url(#stress-fringe)" />

	{#if myCanvas.activeElement === shape && myCanvas.activeElementMode === "resize"}
		{#each shape.points as point, idx (idx)}
			<rect
				class="point center"
				x={point.d3Coord.x - 5 / myCanvas.scale}
				y={point.d3Coord.y - 5 / myCanvas.scale}
				width={10 / myCanvas.scale}
				height={10 / myCanvas.scale}
				role="none"
				onmousedown={() => startMove(idx)}>
			</rect>
		{/each}
	{:else if myCanvas.activeElement === shape && myCanvas.activeElementMode !== "resize"}
		{#each shape.points as point, idx (idx)}
			<circle
				class="point"
				cx={point.d3Coord.x}
				cy={point.d3Coord.y}
				r={5 / myCanvas.scale}
				role="none"
				onmousedown={() => startMove(idx)}>
			</circle>
		{/each}
	{/if}
</g>
