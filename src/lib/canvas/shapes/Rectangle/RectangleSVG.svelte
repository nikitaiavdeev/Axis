<script lang="ts">
	// Import canvas context and shape classes
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Rectangle } from "./rune.svelte";

	// Import constants and utilities
	import { MARKER_SIZE } from "$lib/constants";
	import { Point } from "$lib/canvas/point/rune.svelte";
	import { cn } from "$lib/utils.js";

	// Get Rectangle shape from props
	let { shape }: { shape: Rectangle } = $props();

	// Effect: Handles mouse interactions for editing/moving/resizing the rectangle
	$effect(() => {
		if (!shape.editedPoint) return;

		// Move mode: update point position with mouse
		if (
			(myCanvas.newShape === shape && shape.editedPoint === shape.referencePoint) ||
			(myCanvas.uiOptions.editMode === "move" &&
				(myCanvas.editShape === shape || myCanvas.editShape == shape.editedPoint))
		) {
			shape.editedPoint.xMove(myCanvas.mouse.x);
			shape.editedPoint.yMove(myCanvas.mouse.y);
		}
		// Resize mode: swap edited point and resize
		else if (
			myCanvas.newShape === shape ||
			((myCanvas.activeShape === shape || myCanvas.activeShape === shape.editedPoint) &&
				myCanvas.mouse.down)
		) {
			shape.swapEditedPoint();

			shape.editedPoint.xResize(myCanvas.mouse.x);
			shape.editedPoint.yResize(myCanvas.mouse.y);
		}
	});

	// Derived: Filter unique points for rendering markers
	const uniquePoints = $derived.by(() => {
		const editedPointFiltered = shape.editedPoint
			? Object.entries(shape.points)
					// Remove all nodes with same coords as selected (except the selected itself)
					.filter(([_, point]) => {
						return (
							`${point.x},${point.y},${point === shape.editedPoint}` !==
							`${shape.editedPoint!.x},${shape.editedPoint!.y},false`
						);
					})
			: Object.entries(shape.points);

		// Remove duplicate points by coordinates
		return Object.fromEntries(
			editedPointFiltered.filter(([_, point], index, arr) => {
				const keyStr = `${point.x},${point.y}`;
				return index == arr.findIndex(([_, p]) => `${p.x},${p.y}` === keyStr);
			})
		);
	});

	// Handle shape or point selection for editing
	const editShape = (shapeOrPoint = shape as Rectangle | Point) => {
		// Ignore if new shape is being created
		if (myCanvas.newShape) return;

		// Toggle edit mode if already selected
		if (myCanvas.editShape === shapeOrPoint) {
			myCanvas.uiOptions.editMode = myCanvas.uiOptions.editMode === "move" ? "resize" : "move";
		} else {
			myCanvas.editShape = shapeOrPoint;
		}
	};

	// Start moving a point (set as editedPoint)
	const startMove = (point: Point) => {
		if (myCanvas.newShape !== shape) {
			shape.editedPoint = point;
		}
	};
</script>

<!--  SVG group for the rectangle and its points  -->
<g
	class:hole={shape.isHole}
	class:hoverable={myCanvas.newShape === undefined && !myCanvas.mouse.down}
	class:selected={myCanvas.activeShape === shape}
	class:move={myCanvas.editShape === shape && myCanvas.uiOptions.editMode === "move"}
	class:resize={myCanvas.editShape === shape && myCanvas.uiOptions.editMode === "resize"}>
	<!-- Rectangle shape path -->
	{myCanvas.editShape}
	<path
		class="shape"
		role="none"
		d="
    M{shape.points.leftLower.d3Coord.x} {shape.points.leftLower.d3Coord.y}
    L{shape.points.leftUpper.d3Coord.x} {shape.points.leftUpper.d3Coord.y}
    L{shape.points.rightUpper.d3Coord.x} {shape.points.rightUpper.d3Coord.y}
    L{shape.points.rightLower.d3Coord.x} {shape.points.rightLower.d3Coord.y}
    Z"
		onclick={() => editShape()} />

	<!-- Render points as circles for resize mode or new shape creation -->
	{#if myCanvas.newShape === shape || myCanvas.uiOptions.editMode === "resize"}
		{#each Object.entries(uniquePoints) as [pointName, point] (pointName)}
			<circle
				class={cn(
					"point",
					myCanvas.activeShape !== shape ? "fill-transparent" : "",
					shape.editedPoint !== point ? "hover:fill-marker-hover" : "",
					shape.editedPoint === point && myCanvas.newShape !== shape ? "fill-marker-selected" : ""
				)}
				style="cursor: {myCanvas.editShape === shape ? point.resizeCursor : 'point'};"
				role="none"
				cx={point.d3Coord.x}
				cy={point.d3Coord.y}
				r={MARKER_SIZE / myCanvas.scale}
				onclick={() => {
					if (myCanvas.mouse.down) return;
					editShape(point);
				}}
				onmousedown={() => startMove(point)}>
			</circle>
		{/each}
		<!-- Render points as rectangles for move mode -->
	{:else if myCanvas.uiOptions.editMode === "move"}
		{#each Object.entries(uniquePoints) as [pointName, point] (pointName)}
			<rect
				class={cn(
					"point cursor-move",
					myCanvas.activeShape !== shape ? "fill-transparent" : "",
					shape.editedPoint !== point ? "hover:fill-marker-hover" : "",
					shape.editedPoint === point ? "fill-marker-selected" : ""
				)}
				role="none"
				x={point.d3Coord.x - MARKER_SIZE / myCanvas.scale}
				y={point.d3Coord.y - MARKER_SIZE / myCanvas.scale}
				rx={(0.2 * MARKER_SIZE) / myCanvas.scale}
				width={(2 * MARKER_SIZE) / myCanvas.scale}
				height={(2 * MARKER_SIZE) / myCanvas.scale}
				onmousedown={() => startMove(point)}>
			</rect>
		{/each}
	{/if}
</g>
