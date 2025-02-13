<script lang="ts">
	// Icons
	import { Trash2 } from "lucide-svelte";

	// UI
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { cn } from "$lib/utils.js";

	// Rune
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Circle, ReferencePoint } from "./rune.svelte";
	import { ui } from "$lib/runes/ui.svelte";
	import { onMount } from "svelte";
	import { roundFloat } from "$lib/scripts/helpers.svelte";

	let { shape }: { shape: Circle } = $props();

	// Placeholder values while user click screen or type manually
	let refX = $state(undefined as undefined | number),
		refY = $state(undefined as undefined | number),
		radius = $state(undefined as undefined | number);

	// Effect if shapeangle has changed
	$effect(() => {
		if (myCanvas.editShape.shape === shape) {
			refX = myCanvas.editShape.shape.refX;
			refY = myCanvas.editShape.shape.refY;
			radius = myCanvas.editShape.shape.radius;
		}
	});

	// Effect if Placeholders been changed or mouse moved
	$effect(() => {
		if (refX !== undefined) {
			shape.refX = Number(refX);
		} else {
			shape.refX = roundFloat(ui.mouse.x);
		}

		if (refY !== undefined) {
			shape.refY = Number(refY);
		} else {
			shape.refY = roundFloat(ui.mouse.y);
		}

		if (radius !== undefined) {
			shape.radius = Number(radius);
		} else if (refX !== undefined && refY !== undefined) {
			switch (shape.referencePoint) {
				case ReferencePoint.middleLeft:
					shape.radius = roundFloat(0.5 * (ui.mouse.x - refX));
					break;
				case ReferencePoint.middleRight:
					shape.radius = roundFloat(0.5 * (refX - ui.mouse.x));
					break;
				case ReferencePoint.middleLower:
					shape.radius = roundFloat(0.5 * (ui.mouse.y - refY));
					break;
				case ReferencePoint.middleUpper:
					shape.radius = roundFloat(0.5 * (refY - ui.mouse.y));
					break;
				case ReferencePoint.center:
					shape.radius = roundFloat(Math.sqrt((ui.mouse.x - refX) ** 2 + (ui.mouse.y - refY) ** 2));
			}
		}

		// Swap reference point if height is negative
		if (shape.radius < 0) {
			switch (shape.referencePoint) {
				case ReferencePoint.middleLeft:
					shape.referencePoint = ReferencePoint.middleRight;
					break;
				case ReferencePoint.middleRight:
					shape.referencePoint = ReferencePoint.middleLeft;
					break;
				case ReferencePoint.middleLower:
					shape.referencePoint = ReferencePoint.middleUpper;
					break;
				case ReferencePoint.middleUpper:
					shape.referencePoint = ReferencePoint.middleLower;
					break;
			}

			if (radius !== undefined) {
				radius *= -1;
			} else {
				shape.radius *= -1;
			}
		}
	});

	onMount(() => {
		const contentElm = myCanvas.svg.node();

		if (!contentElm) return;

		const handleClick = () => {
			if (refX !== undefined && refY !== undefined) {
				radius = roundFloat(shape.radius);
			}

			if (refX === undefined) {
				refX = roundFloat(shape.refX);
			}

			if (refY === undefined) {
				refY = roundFloat(shape.refY);
			}

			createShape();
		};

		contentElm.addEventListener("click", handleClick);

		// Remove the listener on component unmount
		return () => {
			contentElm.removeEventListener("click", handleClick);
		};
	});

	const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeMenu();
			} else if (event.key === "Enter") {
				createShape();
			}
		},
		createShape = () => {
			if (
				myCanvas.newShape.shape &&
				refX !== undefined &&
				refY !== undefined &&
				radius !== undefined
			) {
				// Register new shape
				myCanvas.shapes.push(myCanvas.newShape.shape);

				// Clean and start creating new shape
				refX = undefined;
				refY = undefined;
				radius = undefined;
				myCanvas.newShape.createNew(new Circle(0, 0, 0));
			}
		},
		deleteShape = () => {
			shape.clean();
			myCanvas.editShape.clean();
		},
		closeMenu = () => {
			myCanvas.newShape.clean();
			myCanvas.editShape.clean();
		};
</script>

{#snippet marker(refPoint: ReferencePoint, cx: number, cy: number, r: number)}
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

<Card.Root
	class="absolute left-4 top-1/3 inline-flex w-[280px] -translate-y-1/2 flex-col gap-y-4 rounded-md p-4">
	<div class="flex flex-col gap-1.5">
		<Label>Reference Point</Label>
		<svg class="w-full" width="100" height="100" viewBox="0 0 100 100">
			<g class:hole={shape.isHole}>
				<circle class="shape" cx="50" cy="50" r="40"></circle>

				{@render marker(ReferencePoint.middleLeft, 10, 50, 4)}
				{@render marker(ReferencePoint.middleUpper, 50, 10, 4)}
				{@render marker(ReferencePoint.middleRight, 90, 50, 4)}
				{@render marker(ReferencePoint.middleLower, 50, 90, 4)}
				{@render marker(ReferencePoint.center, 50, 50, 6)}
			</g>
		</svg>
	</div>

	<div class="flex w-full flex-row gap-2">
		<div class="flex-1 flex-col gap-1.5">
			<Label for="x_loc">X loc, in</Label>
			<Input type="number" id="x_loc" bind:value={refX} placeholder={shape.refX.toFixed(3)} />
		</div>

		<div class="flex-1 flex-col gap-1.5">
			<Label for="y_loc">Y loc, in</Label>
			<Input type="number" id="y_loc" bind:value={refY} placeholder={shape.refY.toFixed(3)} />
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

	<div class="flex flex-row justify-end gap-2">
		{#if myCanvas.newShape.shape === shape}
			<Button onclick={() => createShape()}>Create</Button>
		{:else if myCanvas.editShape.shape === shape}
			<Button class="bg-destructive" onclick={deleteShape}><Trash2 />Delete</Button>
		{/if}
		<Button variant="secondary" onclick={closeMenu}>Cancel</Button>
	</div>
</Card.Root>

<svelte:window onkeydown={onKeyDown} />
