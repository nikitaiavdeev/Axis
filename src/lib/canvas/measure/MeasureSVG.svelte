<script lang="ts">
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { ui } from "$lib/runes/ui.svelte";
	import { roundFloat } from "$lib/scripts/helpers.svelte";
	import { Measure } from "./rune.svelte";

	let { shape }: { shape: Measure } = $props();

	const leftLowerPointXY = $derived(shape.points.leftLower.d3Coord),
		leftUpperPointXY = $derived(shape.points.leftUpper.d3Coord),
		rightUpperPointXY = $derived(shape.points.rightUpper.d3Coord),
		rightLowerPointXY = $derived(shape.points.rightLower.d3Coord);

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
					x: shape.leftLowerX,
					y: shape.leftLowerY,
				},
				rightUpper: {
					x: shape.leftLowerX + shape.width,
					y: shape.leftLowerY + shape.height,
				},
			};

			ui.mouse.down = true;
		};
</script>

<g
	class:hoverable={myCanvas.newShape.shape === undefined && !ui.mouse.down}
	class:selected={myCanvas.editShape.shape === shape}
	class:move={myCanvas.editShape.shape === shape && ui.options.editMode === "move"}
	class:resize={myCanvas.editShape.shape === shape && ui.options.editMode === "resize"}>
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

	{#if myCanvas.editShape.shape === shape && ui.options.editMode === "resize"}
		{#each Object.entries(shape.points) as [pointName, point] (pointName)}
			<rect
				class="point center"
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
