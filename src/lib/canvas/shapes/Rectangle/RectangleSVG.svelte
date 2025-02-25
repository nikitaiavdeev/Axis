<script lang="ts">
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { ui } from "$lib/runes/ui.svelte";
	import { roundFloat } from "$lib/scripts/helpers.svelte";
	import { Rectangle } from "./rune.svelte";

	let { shape }: { shape: Rectangle } = $props();

	let moveStart = $state({
		pointName: "leftLower" as keyof typeof shape.points,
		clicked: {
			x: 0,
			y: 0,
		},
		leftLower: {
			x: 0,
			y: 0,
		},
		rightUpper: {
			x: 0,
			y: 0,
		},
	});

	// $effect(() => {
	// 	if (myCanvas.editShape.shape === shape && ui.mouse.down) {
	// 		const newLeftLower = {
	// 				x: moveStart.leftLower.x,
	// 				y: moveStart.leftLower.y,
	// 			},
	// 			newRightUpper = {
	// 				x: moveStart.rightUpper.x,
	// 				y: moveStart.rightUpper.y,
	// 			};

	// 		if (ui.options.editMode === "move" || moveStart.pointName === "center") {
	// 			newLeftLower.x += ui.mouse.x - moveStart.clicked.x;
	// 			newLeftLower.y += ui.mouse.y - moveStart.clicked.y;
	// 			newRightUpper.x += ui.mouse.x - moveStart.clicked.x;
	// 			newRightUpper.y += ui.mouse.y - moveStart.clicked.y;
	// 		} else {
	// 			switch (moveStart.pointName) {
	// 				case "leftLower":
	// 					newLeftLower.x = ui.mouse.x;
	// 					newLeftLower.y = ui.mouse.y;
	// 					break;
	// 				case "middleLeft":
	// 					newLeftLower.x = ui.mouse.x;
	// 					break;
	// 				case "leftUpper":
	// 					newLeftLower.x = ui.mouse.x;
	// 					newRightUpper.y = ui.mouse.y;
	// 					break;
	// 				case "middleUpper":
	// 					newRightUpper.y = ui.mouse.y;
	// 					break;
	// 				case "rightUpper":
	// 					newRightUpper.x = ui.mouse.x;
	// 					newRightUpper.y = ui.mouse.y;
	// 					break;
	// 				case "middleRight":
	// 					newRightUpper.x = ui.mouse.x;
	// 					break;
	// 				case "rightLower":
	// 					newRightUpper.x = ui.mouse.x;
	// 					newLeftLower.y = ui.mouse.y;
	// 					break;
	// 				case "middleLower":
	// 					newLeftLower.y = ui.mouse.y;
	// 			}
	// 		}

	// 		// Swap corners
	// 		if (newLeftLower.x > newRightUpper.x) {
	// 			[newLeftLower.x, newRightUpper.x] = [newRightUpper.x, newLeftLower.x];
	// 		}
	// 		if (newLeftLower.y > newRightUpper.y) {
	// 			[newLeftLower.y, newRightUpper.y] = [newRightUpper.y, newLeftLower.y];
	// 		}

	// 		shape.width = roundFloat(newRightUpper.x - newLeftLower.x);
	// 		shape.height = roundFloat(newRightUpper.y - newLeftLower.y);

	// 		switch (shape.referencePoint) {
	// 			case ReferencePoint.leftLower:
	// 			case ReferencePoint.middleLeft:
	// 			case ReferencePoint.leftUpper:
	// 				shape.refX = roundFloat(newLeftLower.x);
	// 				break;
	// 			case ReferencePoint.rightLower:
	// 			case ReferencePoint.middleRight:
	// 			case ReferencePoint.rightUpper:
	// 				shape.refX = roundFloat(newRightUpper.x);
	// 				break;
	// 			case ReferencePoint.middleLower:
	// 			case ReferencePoint.middleUpper:
	// 			case ReferencePoint.center:
	// 				shape.refX = roundFloat(0.5 * (newLeftLower.x + newRightUpper.x));
	// 				break;
	// 		}

	// 		switch (shape.referencePoint) {
	// 			case ReferencePoint.leftLower:
	// 			case ReferencePoint.middleLower:
	// 			case ReferencePoint.rightLower:
	// 				shape.refY = roundFloat(newLeftLower.y);
	// 				break;
	// 			case ReferencePoint.leftUpper:
	// 			case ReferencePoint.middleUpper:
	// 			case ReferencePoint.rightUpper:
	// 				shape.refY = roundFloat(newRightUpper.y);
	// 				break;
	// 			case ReferencePoint.middleLeft:
	// 			case ReferencePoint.middleRight:
	// 			case ReferencePoint.center:
	// 				shape.refY = roundFloat(0.5 * (newLeftLower.y + newRightUpper.y));
	// 				break;
	// 		}
	// 	}
	// });

	const editShape = () => {
			// Togle mode if shape already selected
			if (myCanvas.editShape.shape === shape) {
				myCanvas.editShape.toggleMode();
			} else if (myCanvas.newShape.shape === undefined) {
				myCanvas.editShape.editShape(shape);
			}
		},
		startMove = (x: number, y: number, pointName: string) => {
			moveStart = {
				pointName: pointName as keyof typeof shape.points,
				clicked: {
					x: x,
					y: y,
				},
				leftLower: {
					x: shape.points.leftLower.x,
					y: shape.points.leftLower.y,
				},
				rightUpper: {
					x: shape.points.leftLower.x + shape.width,
					y: shape.points.leftLower.y + shape.height,
				},
			};

			ui.mouse.down = true;
		};
</script>

<g
	class:hole={shape.isHole}
	class:hoverable={myCanvas.newShape.shape === undefined && !ui.mouse.down}
	class:selected={myCanvas.editShape.shape === shape}
	class:move={myCanvas.editShape.shape === shape && ui.options.editMode === "move"}
	class:resize={myCanvas.editShape.shape === shape && ui.options.editMode === "resize"}>

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
	{#if myCanvas.editShape.shape === shape && ui.options.editMode === "resize"}
		{#each Object.entries(shape.points) as [pointName, point] (pointName)}
			<rect
				class="point {pointName}"
				x={point.d3Coord.x - 5 / myCanvas.scale}
				y={point.d3Coord.y - 5 / myCanvas.scale}
				width={10 / myCanvas.scale}
				height={10 / myCanvas.scale}
				role="none"
				onmousedown={() => startMove(point.x, point.y, pointName)}>
			</rect>
		{/each}
	{:else if myCanvas.newShape.shape === shape || myCanvas.editShape.shape === shape}
		{#each Object.entries(shape.points) as [pointName, point] (pointName)}
			<circle
				class="point"
				cx={point.d3Coord.x}
				cy={point.d3Coord.y}
				r={5 / myCanvas.scale}
				role="none"
				onmousedown={() => startMove(point.x, point.y, pointName)}>
			</circle>
		{/each}
	{/if}
</g>
