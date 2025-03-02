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
	import { Rectangle, ReferencePoint } from "./rune.svelte";
	import { ui } from "$lib/runes/ui.svelte";
	import { onMount } from "svelte";
	import { roundFloat } from "$lib/scripts/helpers.svelte";

	let { shape }: { shape: Rectangle } = $props();

	// Placeholder values while user click screen or type manually
	let refX = $state(undefined as undefined | number),
		refY = $state(undefined as undefined | number),
		width = $state(undefined as undefined | number),
		height = $state(undefined as undefined | number);

	// Effect if rectangle has changed
	$effect(() => {
		if (myCanvas.editShape.shape === shape) {
			refX = myCanvas.editShape.shape.refX;
			refY = myCanvas.editShape.shape.refY;
			width = myCanvas.editShape.shape.width;
			height = myCanvas.editShape.shape.height;
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

		if (width !== undefined) {
			shape.width = Number(width);
		} else if (refX !== undefined) {
			if (
				[ReferencePoint.middleLower, ReferencePoint.center, ReferencePoint.middleUpper].includes(
					shape.referencePoint
				)
			) {
				shape.width = roundFloat(2 * Math.abs(ui.mouse.x - refX));
			} else if (
				[ReferencePoint.rightLower, ReferencePoint.middleRight, ReferencePoint.rightUpper].includes(
					shape.referencePoint
				)
			) {
				shape.width = roundFloat(refX - ui.mouse.x);
			} else {
				shape.width = roundFloat(ui.mouse.x - refX);
			}
		}

		if (height !== undefined) {
			shape.height = Number(height);
		} else if (refY !== undefined) {
			if (
				[ReferencePoint.middleLeft, ReferencePoint.center, ReferencePoint.middleRight].includes(
					shape.referencePoint
				)
			) {
				shape.height = roundFloat(2 * Math.abs(ui.mouse.y - refY));
			} else if (
				[ReferencePoint.leftUpper, ReferencePoint.middleUpper, ReferencePoint.rightUpper].includes(
					shape.referencePoint
				)
			) {
				shape.height = roundFloat(refY - ui.mouse.y);
			} else {
				shape.height = roundFloat(ui.mouse.y - refY);
			}
		}

		// Swap reference point if height is negative
		if (shape.height < 0) {
			switch (shape.referencePoint) {
				case ReferencePoint.leftLower:
					shape.referencePoint = ReferencePoint.leftUpper;
					break;
				case ReferencePoint.leftUpper:
					shape.referencePoint = ReferencePoint.leftLower;
					break;
				case ReferencePoint.middleLower:
					shape.referencePoint = ReferencePoint.middleUpper;
					break;
				case ReferencePoint.middleUpper:
					shape.referencePoint = ReferencePoint.middleLower;
					break;
				case ReferencePoint.rightLower:
					shape.referencePoint = ReferencePoint.rightUpper;
					break;
				case ReferencePoint.rightUpper:
					shape.referencePoint = ReferencePoint.rightLower;
					break;
			}

			if (height !== undefined) {
				height *= -1;
			} else {
				shape.height *= -1;
			}
		}

		if (shape.width < 0) {
			switch (shape.referencePoint) {
				case ReferencePoint.leftLower:
					shape.referencePoint = ReferencePoint.rightLower;
					break;
				case ReferencePoint.rightLower:
					shape.referencePoint = ReferencePoint.leftLower;
					break;
				case ReferencePoint.middleLeft:
					shape.referencePoint = ReferencePoint.middleRight;
					break;
				case ReferencePoint.middleRight:
					shape.referencePoint = ReferencePoint.middleLeft;
					break;
				case ReferencePoint.leftUpper:
					shape.referencePoint = ReferencePoint.rightUpper;
					break;
				case ReferencePoint.rightUpper:
					shape.referencePoint = ReferencePoint.leftUpper;
					break;
			}
			if (width !== undefined) {
				width *= -1;
			} else {
				shape.width *= -1;
			}
		}
	});

	onMount(() => {
		const contentElm = myCanvas.svg.node();

		if (!contentElm) return;

		const handleClick = () => {
			if (refX === undefined) {
				refX = roundFloat(shape.refX);
			} else if (width === undefined) {
				width = roundFloat(shape.width);
			}

			if (refY === undefined) {
				refY = roundFloat(shape.refY);
			} else if (height === undefined) {
				height = roundFloat(shape.height);
			}

			createShape();
		};

		if (myCanvas.newShape.shape === shape) {
			contentElm.addEventListener("click", handleClick);

			// Remove the listener on component unmount
			return () => {
				contentElm.removeEventListener("click", handleClick);
			};
		}
	});

	const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeMenu();
			} else if (myCanvas.newShape.shape === shape && event.key === "Enter") {
				createShape();
			}
		},
		createShape = () => {
			if (refX !== undefined && refY !== undefined && width !== undefined && height !== undefined) {
				// Register new shape
				myCanvas.shapes.push(shape);

				// Clean and start creating new shape
				refX = undefined;
				refY = undefined;
				width = undefined;
				height = undefined;
				myCanvas.newShape.createNew(new Rectangle(0, 0, 0, 0));
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
				<rect class="shape" x="10" y="10" width="80" height="80"></rect>

				{@render marker(ReferencePoint.leftLower, 10, 90, 6)}
				{@render marker(ReferencePoint.middleLeft, 10, 50, 4)}
				{@render marker(ReferencePoint.leftUpper, 10, 10, 6)}
				{@render marker(ReferencePoint.middleUpper, 50, 10, 4)}
				{@render marker(ReferencePoint.rightUpper, 90, 10, 6)}
				{@render marker(ReferencePoint.middleRight, 90, 50, 4)}
				{@render marker(ReferencePoint.rightLower, 90, 90, 6)}
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
			<Label for="width">Width, in</Label>
			<Input
				type="number"
				id="width"
				bind:value={width}
				placeholder={refX !== undefined ? shape.width.toFixed(3) : "width"} />
		</div>

		<div class="flex-1 flex-col gap-1.5">
			<Label for="height">Height, in</Label>
			<Input
				type="number"
				id="height"
				bind:value={height}
				placeholder={refY !== undefined ? shape.height.toFixed(3) : "height"} />
		</div>
	</div>

	<div class="flex w-full items-center space-x-2">
		<Checkbox id="is_hole" bind:checked={shape.isHole} />
		<Label for="is_hole">Is Hole</Label>
	</div>

	<div class="flex flex-row gap-2">
		{#if myCanvas.newShape.shape === shape}
			<Button class="grow" onclick={() => createShape()}>Create</Button>
		{:else if myCanvas.editShape.shape === shape}
			<Button class="grow" variant="destructive" onclick={deleteShape}><Trash2 />Delete</Button>
		{/if}
		<Button class="grow" variant="secondary" onclick={closeMenu}>Cancel</Button>
	</div>
</Card.Root>

<svelte:window onkeydown={onKeyDown} />
