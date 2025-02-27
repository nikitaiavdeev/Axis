<script lang="ts">
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Rectangle } from "./rune.svelte";

	let { shape }: { shape: Rectangle } = $props();

	let editedPoint = $state("leftLower" as Rectangle["referencePoint"]);

	$effect(() => {
		if (myCanvas.activeElement === shape && myCanvas.mouse.down) {
			if (myCanvas.activeElementMode === "move") {
				shape.points[editedPoint].xMove(myCanvas.mouse.x);
				shape.points[editedPoint].yMove(myCanvas.mouse.y);
			} else if (myCanvas.activeElementMode === "resize") {
				shape.points[editedPoint].xResize(myCanvas.mouse.x);
				shape.points[editedPoint].yResize(myCanvas.mouse.y);

				// Swap reference point if resize caused to change it
				if (
					myCanvas.mouse.x < shape.cx &&
					["rightLower", "rightUpper", "middleRight"].includes(editedPoint)
				) {
					editedPoint = shape.swapReferencePoint("width", editedPoint);
				} else if (
					myCanvas.mouse.x > shape.cx &&
					["leftLower", "leftUpper", "middleLeft"].includes(editedPoint)
				) {
					editedPoint = shape.swapReferencePoint("width", editedPoint);
				}

				if (
					myCanvas.mouse.y < shape.cy &&
					["leftUpper", "rightUpper", "middleUpper"].includes(editedPoint)
				) {
					editedPoint = shape.swapReferencePoint("height", editedPoint);
				} else if (
					myCanvas.mouse.y > shape.cy &&
					["leftLower", "rightLower", "middleLower"].includes(editedPoint)
				) {
					editedPoint = shape.swapReferencePoint("height", editedPoint);
				}
			}
		}
	});

	const editShape = () => {
		const { activeElement, activeElementMode, uiOptions } = myCanvas;

		// Ignore click if new shape is creating
		if (activeElementMode === 'new') return

		// Togle mode if shape already selected
		if (activeElement === shape) {
			uiOptions.editMode = uiOptions.editMode === "move" ? "resize" : "move";
		} else if (activeElement === undefined) {
			myCanvas.activeElement = shape;
		}

		myCanvas.activeElementMode = myCanvas.uiOptions.editMode;
	};
	const startMove = (pointName: Rectangle["referencePoint"]) => {
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
				onmousedown={() => startMove(pointName as Rectangle["referencePoint"])}>
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
				onmousedown={() => startMove(pointName as Rectangle["referencePoint"])}>
			</circle>
		{/each}
	{/if}
</g>
