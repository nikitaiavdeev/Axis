<script lang="ts">
	// Icons
	import { Trash2 } from "lucide-svelte";

	// UI
	import ShapeForm from "$lib/components/ui/ShapeForm.svelte";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { cn } from "$lib/utils.js";

	// Rune
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Circle } from "./rune.svelte";

	let { shape }: { shape: Circle } = $props();

	// ShapeForm instance
	let shapeForm = $state<ShapeForm>();

	// Placeholder values while user click screen or type manually
	let refX = $state<number | undefined>(undefined),
		refY = $state<number | undefined>(undefined),
		radius = $state<number | undefined>(undefined);

	// Reference point
	const referencePoint = $derived(shape.points[shape.referencePoint]);

	// Effect: Update placeholders when rectangle changes
	$effect(() => {
		if (myCanvas.activeElementMode !== "new") {
			refX = Number(referencePoint.x.toFixed(4));
			refY = Number(referencePoint.y.toFixed(4));
			radius = Number(shape.radius.toFixed(4));
		}
	});

	// Effect: Update shape properties based on user input or mouse movement
	$effect(() => {
		if (myCanvas.activeElementMode == "resize") {
			referencePoint.xResize(Number(refX));
			referencePoint.yResize(Number(refY));
			return;
		} else {
			referencePoint.xMove(refX === undefined ? myCanvas.mouse.x : Number(refX));
			referencePoint.yMove(refY === undefined ? myCanvas.mouse.y : Number(refY));
		}

		if (radius !== undefined) {
			shape.radius = Number(radius);
		} else if (refX !== undefined && refY !== undefined) {
			switch (shape.referencePoint) {
				case "middleLeft":
					shape.radius = 0.5 * (myCanvas.mouse.x - refX);
					break;
				case "middleRight":
					shape.radius = 0.5 * (refX - myCanvas.mouse.x);
					break;
				case "middleLower":
					shape.radius = 0.5 * (myCanvas.mouse.y - refY);
					break;
				case "middleUpper":
					shape.radius = 0.5 * (refY - myCanvas.mouse.y);
					break;
				case "center":
					shape.radius = Math.sqrt((myCanvas.mouse.x - refX) ** 2 + (myCanvas.mouse.y - refY) ** 2);
			}
		}
	});

	const clickHandle = () => {
		if (refX !== undefined && refY !== undefined) {
			radius = Number(shape.radius.toFixed(4));
		}

		if (refX === undefined) {
			refX = Number(referencePoint.x.toFixed(4));
		}

		if (refY === undefined) {
			refY = Number(referencePoint.y.toFixed(4));
		}
	};
	const createShapeCallback = () => {
		if (refX !== undefined && refY !== undefined && radius !== undefined) {
			// Save current reference point and isHole
			const currentReferencePoint = shape.referencePoint,
				currentIsHole = shape.isHole;

			// Register new shape
			myCanvas.shapes.push(shape);

			// Clean and start creating new shape
			refX = undefined;
			refY = undefined;
			radius = undefined;

			myCanvas.activeElement = new Circle(0, 0, 0, currentReferencePoint, currentIsHole);
		}
	};
</script>

{#snippet marker(refPoint: Circle["referencePoint"], cx: number, cy: number, r: number)}
	<circle
		class={cn("point hoverable", shape.referencePoint == refPoint ? "selected" : "")}
		{cx}
		{cy}
		{r}
		role="none"
		onclick={() => {
			shape.referencePoint = refPoint;
		}}>
	</circle>
{/snippet}

<ShapeForm bind:this={shapeForm} element={shape} {createShapeCallback} {clickHandle}>
	<div class="flex flex-col gap-1.5">
		<Label>Reference Point</Label>
		<svg class="w-full" width="100" height="100" viewBox="0 0 100 100">
			<g class:hole={shape.isHole}>
				<circle class="shape" cx="50" cy="50" r="40"></circle>

				{@render marker("middleLeft", 10, 50, 4)}
				{@render marker("middleUpper", 50, 10, 4)}
				{@render marker("middleRight", 90, 50, 4)}
				{@render marker("middleLower", 50, 90, 4)}
				{@render marker("center", 50, 50, 6)}
			</g>
		</svg>
	</div>

	<div class="flex w-full flex-row gap-2">
		<div class="flex-1 flex-col gap-1.5">
			<Label for="x_loc">X loc, in</Label>
			<Input type="number" id="x_loc" bind:value={refX} placeholder={referencePoint.x.toFixed(3)} />
		</div>

		<div class="flex-1 flex-col gap-1.5">
			<Label for="y_loc">Y loc, in</Label>
			<Input type="number" id="y_loc" bind:value={refY} placeholder={referencePoint.x.toFixed(3)} />
		</div>
	</div>

	<div class="flex w-full flex-row gap-2">
		<div class="flex-1 flex-col gap-1.5">
			<Label for="width">Radius, in</Label>
			<Input
				type="number"
				id="radius"
				bind:value={radius}
				placeholder={refX !== undefined && refY !== undefined
					? shape.radius.toFixed(3)
					: "radius"} />
		</div>
	</div>

	<div class="flex w-full items-center space-x-2">
		<Checkbox id="is_hole" bind:checked={shape.isHole} />
		<Label for="is_hole">Is Hole</Label>
	</div>

	<div class="flex flex-row gap-2">
		{#if myCanvas.activeElementMode === "new"}
			<Button class="grow" onclick={createShapeCallback}>Create</Button>
		{:else}
			<Button class="grow" variant="destructive" onclick={() => shapeForm.deleteShape()}>
				<Trash2 />Delete
			</Button>
		{/if}
		<Button class="grow" variant="secondary" onclick={() => shapeForm.closeMenu()}>Cancel</Button>
	</div>
</ShapeForm>
