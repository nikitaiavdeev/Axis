<script lang="ts">
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { ui } from "$lib/runes/ui.svelte";
	import { roundFloat } from "$lib/scripts/helpers.svelte";
	import { Circle, ReferencePoint } from "./rune.svelte";

	let { shape }: { shape: Circle } = $props();

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

	$effect(() => {
		if (myCanvas.editShape.shape === shape && ui.mouse.down) {
			const newLeftLower = {
					x: moveStart.leftLower.x,
					y: moveStart.leftLower.y,
				},
				newRightUpper = {
					x: moveStart.rightUpper.x,
					y: moveStart.rightUpper.y,
				};

			if (ui.options.editMode === "move" || moveStart.pointName === "center") {
				newLeftLower.x += ui.mouse.x - moveStart.clicked.x;
				newLeftLower.y += ui.mouse.y - moveStart.clicked.y;
				newRightUpper.x += ui.mouse.x - moveStart.clicked.x;
				newRightUpper.y += ui.mouse.y - moveStart.clicked.y;
			} else {
				switch (moveStart.pointName) {
					case "middleLeft":
						newLeftLower.x = ui.mouse.x;
						break;
					case "middleUpper":
						newRightUpper.y = ui.mouse.y;
						break;
					case "middleRight":
						newRightUpper.x = ui.mouse.x;
						break;
					case "middleLower":
						newLeftLower.y = ui.mouse.y;
				}
			}

			// Swap corners
			if (newLeftLower.x > newRightUpper.x) {
				[newLeftLower.x, newRightUpper.x] = [newRightUpper.x, newLeftLower.x];
			}
			if (newLeftLower.y > newRightUpper.y) {
				[newLeftLower.y, newRightUpper.y] = [newRightUpper.y, newLeftLower.y];
			}

			if (["middleLeft", "middleRight"].includes(moveStart.pointName)) {
				shape.radius = roundFloat(0.5 * (newRightUpper.x - newLeftLower.x));
				newLeftLower.y = 0.5 * (moveStart.leftLower.y + moveStart.rightUpper.y) - shape.radius;
				newRightUpper.y = 0.5 * (moveStart.leftLower.y + moveStart.rightUpper.y) + shape.radius;
			}

			if (["middleUpper", "middleLower"].includes(moveStart.pointName)) {
				shape.radius = roundFloat(0.5 * (newRightUpper.y - newLeftLower.y));
				newLeftLower.x = 0.5 * (moveStart.leftLower.x + moveStart.rightUpper.x) - shape.radius;
				newRightUpper.x = 0.5 * (moveStart.leftLower.x + moveStart.rightUpper.x) + shape.radius;
			}

			switch (shape.referencePoint) {
				case ReferencePoint.middleLeft:
					shape.refX = roundFloat(newLeftLower.x);
					break;
				case ReferencePoint.middleRight:
					shape.refX = roundFloat(newRightUpper.x);
					break;
				case ReferencePoint.middleLower:
				case ReferencePoint.middleUpper:
				case ReferencePoint.center:
					shape.refX = roundFloat(0.5 * (newLeftLower.x + newRightUpper.x));
					break;
			}

			switch (shape.referencePoint) {
				case ReferencePoint.middleLower:
					shape.refY = roundFloat(newLeftLower.y);
					break;
				case ReferencePoint.middleUpper:
					shape.refY = roundFloat(newRightUpper.y);
					break;
				case ReferencePoint.middleLeft:
				case ReferencePoint.middleRight:
				case ReferencePoint.center:
					shape.refY = roundFloat(0.5 * (newLeftLower.y + newRightUpper.y));
					break;
			}
		}
	});

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
					x: shape.centerX - shape.radius,
					y: shape.centerY - shape.radius,
				},
				rightUpper: {
					x: shape.centerX + shape.radius,
					y: shape.centerY + shape.radius,
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
	<circle
		class="shape"
		cx={shape.points.center.d3Coord.x}
		cy={shape.points.center.d3Coord.y}
		r={shape.radiusD3scale}
		onclick={editShape}
		role="none">
	</circle>

	{#if myCanvas.editShape.shape === shape && ui.options.editMode === "resize"}
		{#each Object.entries(shape.points) as [pointName, point] (pointName)}
			<rect
				class="point {pointName}"
				x={point.d3Coord.x - 5 / myCanvas.scale}
				y={point.d3Coord.y - 5 / myCanvas.scale}
				width={10 / myCanvas.scale}
				height={10 / myCanvas.scale}
				role="none"
				onmousedown={() => startMove(point.x(), point.y(), pointName)}>
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
				onmousedown={() => startMove(point.x(), point.y(), pointName)}>
			</circle>
		{/each}
	{/if}
</g>
