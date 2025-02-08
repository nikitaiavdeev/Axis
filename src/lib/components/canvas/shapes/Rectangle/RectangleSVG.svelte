<script lang="ts">
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { ui } from "$lib/runes/ui.svelte";
	import { roundFloat } from "$lib/scripts/helpers.svelte";
	import { mount } from "svelte";
	import { Rectangle, ReferencePoint } from "./rune.svelte";

	let { rect }: { rect: Rectangle } = $props();

	const leftLowerPointXY = $derived(rect.points.leftLower.d3Coord),
		leftUpperPointXY = $derived(rect.points.leftUpper.d3Coord),
		rightUpperPointXY = $derived(rect.points.rightUpper.d3Coord),
		rightLowerPointXY = $derived(rect.points.rightLower.d3Coord);

	let moveStart = $state({
		pointName: "leftLower" as keyof typeof rect.points,
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
		if (myCanvas.editShape.shape === rect && ui.mouse.down) {
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
					case "leftLower":
						newLeftLower.x = ui.mouse.x;
						newLeftLower.y = ui.mouse.y;
						break;
					case "middleLeft":
						newLeftLower.x = ui.mouse.x;
						break;
					case "leftUpper":
						newLeftLower.x = ui.mouse.x;
						newRightUpper.y = ui.mouse.y;
						break;
					case "middleUpper":
						newRightUpper.y = ui.mouse.y;
						break;
					case "rightUpper":
						newRightUpper.x = ui.mouse.x;
						newRightUpper.y = ui.mouse.y;
						break;
					case "middleRight":
						newRightUpper.x = ui.mouse.x;
						break;
					case "rightLower":
						newRightUpper.x = ui.mouse.x;
						newLeftLower.y = ui.mouse.y;
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

			rect.width = roundFloat(newRightUpper.x - newLeftLower.x);
			rect.height = roundFloat(newRightUpper.y - newLeftLower.y);

			switch (rect.referencePoint) {
				case ReferencePoint.leftLower:
				case ReferencePoint.middleLeft:
				case ReferencePoint.leftUpper:
					rect.refX = roundFloat(newLeftLower.x);
					break;
				case ReferencePoint.rightLower:
				case ReferencePoint.middleRight:
				case ReferencePoint.rightUpper:
					rect.refX = roundFloat(newRightUpper.x);
					break;
				case ReferencePoint.middleLower:
				case ReferencePoint.middleUpper:
				case ReferencePoint.center:
					rect.refX = roundFloat(0.5 * (newLeftLower.x + newRightUpper.x));
					break;
			}

			switch (rect.referencePoint) {
				case ReferencePoint.leftLower:
				case ReferencePoint.middleLower:
				case ReferencePoint.rightLower:
					rect.refY = roundFloat(newLeftLower.y);
					break;
				case ReferencePoint.leftUpper:
				case ReferencePoint.middleUpper:
				case ReferencePoint.rightUpper:
					rect.refY = roundFloat(newRightUpper.y);
					break;
				case ReferencePoint.middleLeft:
				case ReferencePoint.middleRight:
				case ReferencePoint.center:
					rect.refY = roundFloat(0.5 * (newLeftLower.y + newRightUpper.y));
					break;
			}
		}
	});

	const editShape = () => {
			// Togle mode if shape already selected
			if (myCanvas.editShape.shape === rect) {
				myCanvas.editShape.toggleMode();
			} else if (myCanvas.newShape.shape === undefined) {
				myCanvas.editShape.editShape(rect);
			}
		},
		startMove = (x: number, y: number, pointName: string) => {
			moveStart = {
				pointName: pointName as keyof typeof rect.points,
				clicked: {
					x: x,
					y: y,
				},
				leftLower: {
					x: rect.leftLowerX,
					y: rect.leftLowerY,
				},
				rightUpper: {
					x: rect.leftLowerX + rect.width,
					y: rect.leftLowerY + rect.height,
				},
			};

			ui.mouse.down = true;
		};
</script>

<g
	class:hole={rect.isHole}
	class:hoverable={myCanvas.newShape.shape === undefined && !ui.mouse.down}
	class:selected={myCanvas.editShape.shape === rect}
	class:move={myCanvas.editShape.shape === rect && ui.options.editMode === "move"}
	class:resize={myCanvas.editShape.shape === rect && ui.options.editMode === "resize"}>
	<path
		class="shape"
		d="
	M{leftLowerPointXY.x} {leftLowerPointXY.y}
	L{leftUpperPointXY.x} {leftUpperPointXY.y}	
	L{rightUpperPointXY.x} {rightUpperPointXY.y}
	L{rightLowerPointXY.x} {rightLowerPointXY.y}
	Z"
		onclick={editShape}
		role="none" />

	{#if myCanvas.editShape.shape === rect && ui.options.editMode === "resize"}
		{#each Object.entries(rect.points) as [pointName, point]}
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
	{:else if myCanvas.newShape.shape === rect || myCanvas.editShape.shape === rect}
		{#each Object.entries(rect.points) as [pointName, point]}
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
