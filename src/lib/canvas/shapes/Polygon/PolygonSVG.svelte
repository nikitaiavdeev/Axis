<script lang="ts">
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { ui } from "$lib/runes/ui.svelte";
	import { roundFloat } from "$lib/scripts/helpers.svelte";
	import { Polygon } from "./rune.svelte";

	let { shape }: { shape: Polygon } = $props();

	let moveStart = $state({
		pointIdx: 0,
		initPointsCorrds: [] as { x: number; y: number }[],
	});

	$effect(() => {
		if (myCanvas.editShape.shape === shape && ui.mouse.down) {
			if (ui.options.editMode === "move") {
				const dX = ui.mouse.x - moveStart.initPointsCorrds[moveStart.pointIdx].x,
					dY = ui.mouse.y - moveStart.initPointsCorrds[moveStart.pointIdx].y;

				for (let idx = 0; idx < shape.pointCoords.length; idx++) {
					shape.pointCoords[idx].x = roundFloat(moveStart.initPointsCorrds[idx].x + dX);
					shape.pointCoords[idx].y = roundFloat(moveStart.initPointsCorrds[idx].y + dY);
				}
			} else {
				shape.pointCoords[moveStart.pointIdx].x = roundFloat(ui.mouse.x);
				shape.pointCoords[moveStart.pointIdx].y = roundFloat(ui.mouse.y);
			}
		}
	});

	const pathString = $derived.by(() => {
		let pathStr = "";

		for (let idx = 0; idx < shape.points.length; idx++) {
			const d3Coord = shape.points[idx].d3Coord;
			pathStr += `${idx === 0 ? "M" : "L"}${d3Coord.x},${d3Coord.y}`;
		}
		pathStr += "Z";

		return pathStr;
	});

	const editShape = () => {
			// Togle mode if shape already selected
			if (myCanvas.editShape.shape === shape) {
				myCanvas.editShape.toggleMode();
			} else if (myCanvas.newShape.shape === undefined) {
				myCanvas.editShape.editShape(shape);
			}
		},
		startMove = (pointIdx: number) => {
			moveStart = {
				pointIdx: pointIdx,
				initPointsCorrds: $state.snapshot(shape.pointCoords),
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
	<path class="shape" d={pathString} role="none" onclick={editShape} fill="url(#stress-fringe)" />

	{#if myCanvas.editShape.shape === shape && ui.options.editMode === "resize"}
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
	{:else if myCanvas.newShape.shape === shape || myCanvas.editShape.shape === shape}
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
