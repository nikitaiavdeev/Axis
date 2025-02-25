<script lang="ts">
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { roundFloat } from "$lib/scripts/helpers.svelte";
	import { Rectangle } from "./rune.svelte";

	let { shape }: { shape: Rectangle } = $props();

	let editedPoint = $state("leftLower" as keyof typeof shape.points);

	$effect(() => {
		if (myCanvas.activeElement === shape && myCanvas.mouse.down) {
			shape.points[editedPoint].x = myCanvas.mouse.x;
			shape.points[editedPoint].y = myCanvas.mouse.y;
		}
	});

	const editShape = () => {
			// Togle mode if shape already selected
			if (myCanvas.activeElement === shape && myCanvas.activeElementMode !== "new") {
				if (myCanvas.uiOptions.editMode === "move") {
					myCanvas.uiOptions.editMode = "resize";
				} else {
					myCanvas.uiOptions.editMode = "move";
				}
			} else if (myCanvas.activeElement === undefined) {
				myCanvas.activeElement = shape;
			}

			myCanvas.activeElementMode = myCanvas.uiOptions.editMode;
		},
		startMove = (pointName: string) => {
			editedPoint = pointName;
			myCanvas.mouse.down = true;
		};
</script>

<g
	class:hole={shape.isHole}
	class:hoverable={myCanvas.activeElement === undefined && !myCanvas.mouse.down}
	class:selected={myCanvas.activeElement === shape}
	class:move={myCanvas.activeElement === shape && myCanvas.uiOptions.editMode === "move"}
	class:resize={myCanvas.activeElement === shape && myCanvas.uiOptions.editMode === "resize"}>
	<!-- Rectangle shape -->
	<path
		class="shape"
		d="
	M{shape.points.leftLower.d3Coord.x} {shape.points.leftLower.d3Coord.y}
	L{shape.points.leftUpper.d3Coord.x} {shape.points.leftUpper.d3Coord.y}
	L{shape.points.rightUpper.d3Coord.x} {shape.points.rightUpper.d3Coord.y}
	L{shape.points.rightLower.d3Coord.x} {shape.points.rightLower.d3Coord.y}
	Z"
		onclick={editShape}
		role="none" />

	<!-- Points -->
	{#if myCanvas.activeElement === shape && myCanvas.activeElementMode === "resize"}
		{#each Object.entries(shape.points) as [pointName, point] (pointName)}
			<rect
				class="point {pointName}"
				x={point.d3Coord.x - 5 / myCanvas.scale}
				y={point.d3Coord.y - 5 / myCanvas.scale}
				width={10 / myCanvas.scale}
				height={10 / myCanvas.scale}
				role="none"
				onmousedown={() => startMove(pointName)}>
			</rect>
		{/each}
	{:else if myCanvas.activeElement === shape && myCanvas.activeElementMode !== "resize"}
		{#each Object.entries(shape.points) as [pointName, point] (pointName)}
			<circle
				class="point"
				cx={point.d3Coord.x}
				cy={point.d3Coord.y}
				r={5 / myCanvas.scale}
				role="none"
				onmousedown={() => startMove(pointName)}>
			</circle>
		{/each}
	{/if}
</g>
