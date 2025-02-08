<script lang="ts">
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { ui } from "$lib/runes/ui.svelte";
	import { roundFloat } from "$lib/scripts/helpers.svelte";
	import { Rectangle } from "./rune.svelte";

	let { rect }: { rect: Rectangle } = $props();

	const leftLowerPointXY = $derived(rect.points.leftLower.d3Coord),
		leftUpperPointXY = $derived(rect.points.leftUpper.d3Coord),
		rightUpperPointXY = $derived(rect.points.rightUpper.d3Coord),
		rightLowerPointXY = $derived(rect.points.rightLower.d3Coord);

	let moveStart = $state({
		x: 0,
		y: 0,
	});

	$effect(() => {
		if (myCanvas.editShape.shape === rect && ui.mouse.down) {
			rect.refX = roundFloat(ui.mouse.x - moveStart.x);
			rect.refY = roundFloat(ui.mouse.y - moveStart.y);
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
		startMove = (x: number, y: number) => {
			moveStart.x = x - rect.refX;
			moveStart.y = y - rect.refY;
			ui.mouse.down = true;
		};
</script>

<g
	class:hole={rect.isHole}
	class:hoverable={myCanvas.newShape.shape === undefined && !ui.mouse.down}
	class:selected={myCanvas.editShape.shape === rect}
	class:move={myCanvas.editShape.shape === rect && ui.options.editMode === "move"}>
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

	{#if myCanvas.newShape.shape === rect || myCanvas.editShape.shape === rect}
		{#each Object.values(rect.points) as point}
			<circle
				class="point"
				cx={point.d3Coord.x}
				cy={point.d3Coord.y}
				r={4 / myCanvas.scale}
				role="none"
				onmousedown={() => startMove(point.x(), point.y())}>
			</circle>
		{/each}
	{/if}
</g>
