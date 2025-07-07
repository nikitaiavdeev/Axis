<script lang="ts">
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Circle } from "./rune.svelte";

	let { shape }: { shape: Circle } = $props();

	let editedPoint = $state("leftLower" as Circle["referencePoint"]);

	$effect(() => {
		if (myCanvas.editShape === shape && myCanvas.mouse.down) {
			if (myCanvas.uiOptions.editMode === "move") {
				shape.points[editedPoint].xMove(myCanvas.mouse.x);
				shape.points[editedPoint].yMove(myCanvas.mouse.y);
			} else if (myCanvas.uiOptions.editMode === "resize") {
				shape.points[editedPoint].xResize(myCanvas.mouse.x);
				shape.points[editedPoint].yResize(myCanvas.mouse.y);

				// Swap reference point if resize caused to change it
				if (
					myCanvas.mouse.x < shape.cx &&
					["rightLower", "rightUpper", "middleRight"].includes(editedPoint)
				) {
					editedPoint = shape.swapReferencePoint(editedPoint);
				} else if (
					myCanvas.mouse.x > shape.cx &&
					["leftLower", "leftUpper", "middleLeft"].includes(editedPoint)
				) {
					editedPoint = shape.swapReferencePoint(editedPoint);
				}

				if (
					myCanvas.mouse.y < shape.cy &&
					["leftUpper", "rightUpper", "middleUpper"].includes(editedPoint)
				) {
					editedPoint = shape.swapReferencePoint(editedPoint);
				} else if (
					myCanvas.mouse.y > shape.cy &&
					["leftLower", "rightLower", "middleLower"].includes(editedPoint)
				) {
					editedPoint = shape.swapReferencePoint(editedPoint);
				}
			}
		}
	});

	const editShape = () => {
		// Ignore click if new shape is creating
		if (myCanvas.newShape) return;

		// Togle mode if shape already selected
		if (myCanvas.editShape === shape) {
			myCanvas.uiOptions.editMode = myCanvas.uiOptions.editMode === "move" ? "resize" : "move";
		} else if (myCanvas.editShape === undefined) {
			myCanvas.editShape = shape;
		}
	};
	const startMove = (pointName: Circle["referencePoint"]) => {
		editedPoint = pointName;
		myCanvas.mouse.down = true;
	};
</script>

<g
	class:hole={shape.isHole}
	class:hoverable={myCanvas.activeShape === undefined && !myCanvas.mouse.down}
	class:selected={myCanvas.activeShape === shape}
	class:move={myCanvas.editShape === shape && myCanvas.uiOptions.editMode === "move"}
	class:resize={myCanvas.editShape === shape && myCanvas.uiOptions.editMode === "resize"}>
	<circle
		class="shape"
		role="none"
		shape-rendering="geometricPrecision"
		cx={shape.points.center.d3Coord.x}
		cy={shape.points.center.d3Coord.y}
		r={shape.radiusD3scale}
		onclick={editShape}>
	</circle>

	{#if myCanvas.editShape === shape && myCanvas.uiOptions.editMode === "resize"}
		{#each Object.entries(shape.points) as [pointName, point] (pointName)}
			<rect
				class="point {pointName}"
				role="none"
				shape-rendering="geometricPrecision"
				x={point.d3Coord.x - 5 / myCanvas.scale}
				y={point.d3Coord.y - 5 / myCanvas.scale}
				width={10 / myCanvas.scale}
				height={10 / myCanvas.scale}
				onmousedown={() => startMove(pointName as Circle["referencePoint"])}>
			</rect>
		{/each}
	{:else if myCanvas.newShape === shape || (myCanvas.editShape === shape && myCanvas.uiOptions.editMode === "move")}
		{#each Object.entries(shape.points) as [pointName, point] (pointName)}
			<circle
				class="point"
				role="none"
				shape-rendering="geometricPrecision"
				cx={point.d3Coord.x}
				cy={point.d3Coord.y}
				r={5 / myCanvas.scale}
				onmousedown={() => startMove(pointName as Circle["referencePoint"])}>
			</circle>
		{/each}
	{/if}
</g>
