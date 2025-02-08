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

	let { rect }: { rect: Rectangle } = $props();

	// Placeholder values while user click screen or type manually
	let refX = $state(undefined as undefined | number),
		refY = $state(undefined as undefined | number),
		width = $state(undefined as undefined | number),
		height = $state(undefined as undefined | number);

	// Effect if rectangle has changed
	$effect(() => {
		if (myCanvas.editShape.shape === rect) {
			refX = myCanvas.editShape.shape.refX;
			refY = myCanvas.editShape.shape.refY;
			width = myCanvas.editShape.shape.width;
			height = myCanvas.editShape.shape.height;
		}
	});

	// Effect if Placeholders been changed or mouse moved
	$effect(() => {
		if (refX !== undefined) {
			rect.refX = Number(refX);
		} else {
			rect.refX = roundFloat(ui.mouse.x);
		}

		if (refY !== undefined) {
			rect.refY = Number(refY);
		} else {
			rect.refY = roundFloat(ui.mouse.y);
		}

		if (width !== undefined) {
			rect.width = Number(width);
		} else if (refX !== undefined) {
			if (
				[ReferencePoint.middleLower, ReferencePoint.center, ReferencePoint.middleUpper].includes(
					rect.referencePoint
				)
			) {
				rect.width = roundFloat(2 * Math.abs(ui.mouse.x - refX));
			} else if (
				[ReferencePoint.rightLower, ReferencePoint.middleRight, ReferencePoint.rightUpper].includes(
					rect.referencePoint
				)
			) {
				rect.width = roundFloat(refX - ui.mouse.x);
			} else {
				rect.width = roundFloat(ui.mouse.x - refX);
			}
		}

		if (height !== undefined) {
			rect.height = Number(height);
		} else if (refY !== undefined) {
			if (
				[ReferencePoint.middleLeft, ReferencePoint.center, ReferencePoint.middleRight].includes(
					rect.referencePoint
				)
			) {
				rect.height = roundFloat(2 * Math.abs(ui.mouse.y - refY));
			} else if (
				[ReferencePoint.leftUpper, ReferencePoint.middleUpper, ReferencePoint.rightUpper].includes(
					rect.referencePoint
				)
			) {
				rect.height = roundFloat(refY - ui.mouse.y);
			} else {
				rect.height = roundFloat(ui.mouse.y - refY);
			}
		}

		// Swap reference point if height is negative
		if (rect.height < 0) {
			switch (rect.referencePoint) {
				case ReferencePoint.leftLower:
					rect.referencePoint = ReferencePoint.leftUpper;
					break;
				case ReferencePoint.leftUpper:
					rect.referencePoint = ReferencePoint.leftLower;
					break;
				case ReferencePoint.middleLower:
					rect.referencePoint = ReferencePoint.middleUpper;
					break;
				case ReferencePoint.middleUpper:
					rect.referencePoint = ReferencePoint.middleLower;
					break;
				case ReferencePoint.rightLower:
					rect.referencePoint = ReferencePoint.rightUpper;
					break;
				case ReferencePoint.rightUpper:
					rect.referencePoint = ReferencePoint.rightLower;
					break;
			}

			if (height !== undefined) {
				height *= -1;
			} else {
				rect.height *= -1;
			}
		}

		if (rect.width < 0) {
			switch (rect.referencePoint) {
				case ReferencePoint.leftLower:
					rect.referencePoint = ReferencePoint.rightLower;
					break;
				case ReferencePoint.rightLower:
					rect.referencePoint = ReferencePoint.leftLower;
					break;
				case ReferencePoint.middleLeft:
					rect.referencePoint = ReferencePoint.middleRight;
					break;
				case ReferencePoint.middleRight:
					rect.referencePoint = ReferencePoint.middleLeft;
					break;
				case ReferencePoint.leftUpper:
					rect.referencePoint = ReferencePoint.rightUpper;
					break;
				case ReferencePoint.rightUpper:
					rect.referencePoint = ReferencePoint.leftUpper;
					break;
			}
			if (width !== undefined) {
				width *= -1;
			} else {
				rect.width *= -1;
			}
		}
	});

	onMount(() => {
		const contentElm = myCanvas.svg.node();

		if (!contentElm) return;

		const handleClick = () => {
			if (refX === undefined) {
				refX = rect.refX;
			} else if (width === undefined) {
				width = roundFloat(rect.width);
			}

			if (refY === undefined) {
				refY = roundFloat(rect.refY);
			} else if (height === undefined) {
				height = roundFloat(rect.height);
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
				width !== undefined &&
				height !== undefined
			) {
				// Register new shape
				Object.values(myCanvas.newShape.shape.points).forEach((point) => (point.isMagnet = true));
				myCanvas.shapes.push(myCanvas.newShape.shape);

				// Clean and start creating new shape
				refX = undefined;
				refY = undefined;
				width = undefined;
				height = undefined;
				myCanvas.newShape.createNew(new Rectangle(0, 0, 0, 0));
			}
		},
		deleteShape = () => {
			rect.clean();
			myCanvas.editShape.clean();
		},
		closeMenu = () => {
			myCanvas.newShape.clean();
			myCanvas.editShape.clean();
		};
</script>

{#snippet marker(refPoint: ReferencePoint, cx: number, cy: number, r: number)}
	<circle
		class={cn("point hoverable", rect.referencePoint == refPoint ? "selected" : "")}
		{cx}
		{cy}
		{r}
		role="none"
		onclick={() => {
			rect.referencePoint = refPoint;
		}}></circle>
{/snippet}

<Card.Root
	class="absolute left-4 top-1/3 inline-flex w-[280px] -translate-y-1/2 flex-col gap-y-4 rounded-md p-4">
	<div class="flex flex-col gap-1.5">
		<Label>Reference Point</Label>
		<svg class="w-full" width="100" height="100" viewBox="0 0 100 100">
			<g class:hole={rect.isHole}>
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
			<Input type="number" id="x_loc" bind:value={refX} placeholder={rect.refX.toFixed(3)} />
		</div>

		<div class="flex-1 flex-col gap-1.5">
			<Label for="y_loc">Y loc, in</Label>
			<Input type="number" id="y_loc" bind:value={refY} placeholder={rect.refY.toFixed(3)} />
		</div>
	</div>

	<div class="flex w-full flex-row gap-2">
		<div class="flex-1 flex-col gap-1.5">
			<Label for="width">Width, in</Label>
			<Input
				type="number"
				id="width"
				bind:value={width}
				placeholder={refX !== undefined ? rect.width.toFixed(3) : "width"} />
		</div>

		<div class="flex-1 flex-col gap-1.5">
			<Label for="height">Height, in</Label>
			<Input
				type="number"
				id="height"
				bind:value={height}
				placeholder={refY !== undefined ? rect.height.toFixed(3) : "height"} />
		</div>
	</div>

	<div class="flex w-full items-center space-x-2">
		<Checkbox id="is_hole" bind:checked={rect.isHole} />
		<Label for="is_hole">Is Hole</Label>
	</div>

	<div class="flex flex-row justify-end gap-2">
		{#if myCanvas.newShape.shape === rect}
			<Button onclick={() => createShape()}>Create</Button>
		{:else if myCanvas.editShape.shape === rect}
			<Button class="bg-destructive" onclick={deleteShape}><Trash2 />Delete</Button>
		{/if}
		<Button variant="secondary" onclick={closeMenu}>Cancel</Button>
	</div>
</Card.Root>

<svelte:window onkeydown={onKeyDown} />
