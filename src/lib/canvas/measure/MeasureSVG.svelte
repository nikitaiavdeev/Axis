<script lang="ts">
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Measure } from "./rune.svelte";

	let { measure }: { measure: Measure } = $props();

	const p1XY = $derived(measure.points.point1.d3Coord),
		p2XY = $derived(measure.points.point2.d3Coord),
		p3XY = $derived(measure.points.point3.d3Coord),
		offsetDirection = $derived.by(() => {
			const a = p2XY.y - p1XY.y,
				b = p1XY.x - p2XY.x,
				c = p2XY.x * p1XY.y - p1XY.x * p2XY.y,
				s = a * p3XY.x + b * p3XY.y + c,
				len = Math.abs(s) / (a ** 2 + b ** 2);

			return {
				x: a * Math.sign(s) * len,
				y: b * Math.sign(s) * len,
			};
		}),
		p1OffsetXY = $derived({
			x:
				(measure.type == "free" ? offsetDirection.x : 0) +
				(measure.type == "vertical" ? p3XY.x : p1XY.x),
			y:
				(measure.type == "free" ? offsetDirection.y : 0) +
				(measure.type == "horizontal" ? p3XY.y : p1XY.y),
		}),
		p2OffsetXY = $derived({
			x:
				(measure.type == "free" ? offsetDirection.x : 0) +
				(measure.type == "vertical" ? p3XY.x : p2XY.x),
			y:
				(measure.type == "free" ? offsetDirection.y : 0) +
				(measure.type == "horizontal" ? p3XY.y : p2XY.y),
		});

	let editedPoint = $state("point1" as keyof typeof measure.points);

	$effect(() => {
		if (myCanvas.activeElement === measure && myCanvas.mouse.down) {
			if (myCanvas.uiOptions.editMode === "move") {
				measure.points[editedPoint].xMove(myCanvas.mouse.x);
				measure.points[editedPoint].yMove(myCanvas.mouse.y);
			} else {
				measure.points[editedPoint].xResize(myCanvas.mouse.x);
				measure.points[editedPoint].yResize(myCanvas.mouse.y);
			}
		}
	});

	const editMeasure = () => {
			// Ignore click if new shape is creating
			if (myCanvas.activeElementMode === "new") return;

			// Togle mode if measure already selected
			if (myCanvas.activeElement === measure) {
				myCanvas.uiOptions.editMode = myCanvas.uiOptions.editMode === "move" ? "resize" : "move";
			} else if (myCanvas.activeElement === undefined) {
				myCanvas.activeElement = measure;
			}

			myCanvas.activeElementMode = myCanvas.uiOptions.editMode;
		},
		startMove = (pointName: keyof typeof measure.points) => {
			editedPoint = pointName;
			myCanvas.mouse.down = true;
		};
</script>

<g
	class="measure"
	class:hoverable={myCanvas.activeElement === undefined && !myCanvas.mouse.down}
	class:selected={myCanvas.activeElement === measure}
	class:move={myCanvas.activeElement === measure && myCanvas.uiOptions.editMode === "move"}
	class:resize={myCanvas.activeElement === measure && myCanvas.uiOptions.editMode === "resize"}
	style="font-size-adjust:from-font">
	{#if !isNaN(measure.points.point3.x)}
		<line
			x1={p1XY.x}
			y1={p1XY.y}
			x2={p1OffsetXY.x}
			y2={p1OffsetXY.y}
			vector-effect="non-scaling-stroke">
		</line>
		<line
			x1={p2XY.x}
			y1={p2XY.y}
			x2={p2OffsetXY.x}
			y2={p2OffsetXY.y}
			vector-effect="non-scaling-stroke">
		</line>

		<line
			x1={p1OffsetXY.x}
			y1={p1OffsetXY.y}
			x2={p2OffsetXY.x}
			y2={p2OffsetXY.y}
			marker-start="url(#triangle)"
			marker-end="url(#triangle)"
			vector-effect="non-scaling-stroke">
		</line>
		<text
			class="text-sm"
			x={0.5 * (p1OffsetXY.x + p2OffsetXY.x)}
			y={0.5 * (p1OffsetXY.y + p2OffsetXY.y)}
			text-anchor="middle"
			alignment-baseline="middle"
			filter="url(#solid)"
			onclick={editMeasure}
			role="none">
			&nbsp; {measure.dimention} in &nbsp;
		</text>
	{/if}

	{#if myCanvas.activeElement === measure && myCanvas.activeElementMode === "resize"}
		{#each Object.entries(measure.points) as [pointName, point] (pointName)}
			<rect
				class="point center"
				x={point.d3Coord.x - 5 / myCanvas.scale}
				y={point.d3Coord.y - 5 / myCanvas.scale}
				width={10 / myCanvas.scale}
				height={10 / myCanvas.scale}
				role="none"
				onmousedown={() => startMove(pointName as keyof typeof measure.points)}>
			</rect>
		{/each}
	{:else if myCanvas.activeElement === measure && myCanvas.activeElementMode !== "resize"}
		{#each Object.entries(measure.points) as [pointName, point] (pointName)}
			<circle
				class="point"
				cx={point.d3Coord.x}
				cy={point.d3Coord.y}
				r={5 / myCanvas.scale}
				role="none"
				onmousedown={() => startMove(pointName as keyof typeof measure.points)}>
			</circle>
		{/each}
	{/if}
</g>
