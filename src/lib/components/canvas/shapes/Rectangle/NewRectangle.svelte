<script lang="ts">
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

	let { rect }: { rect: Rectangle } = $props();

	let refX = $state(undefined as undefined | number),
		refY = $state(undefined as undefined | number),
		width = $state(undefined as undefined | number),
		height = $state(undefined as undefined | number);

	$effect(() => {
		if (refX !== undefined) {
			rect.refX = refX;
		} else {
			rect.refX = ui.mouse.x;
		}

		if (refY !== undefined) {
			rect.refY = refY;
		} else {
			rect.refY = ui.mouse.y;
		}

		if (width) {
			rect.width = width;
		} else if (refX !== undefined) {
			if (
				[ReferencePoint.middleLower, ReferencePoint.center, ReferencePoint.middleUpper].includes(
					rect.referencePoint
				)
			) {
				rect.width = 2 * (ui.mouse.x - refX);
			} else if (
				[ReferencePoint.rightLower, ReferencePoint.middleRight, ReferencePoint.rightUpper].includes(
					rect.referencePoint
				)
			) {
				rect.width = refX - ui.mouse.x;
			} else {
				rect.width = ui.mouse.x - refX;
			}
		}

		if (height) {
			rect.height = height;
		} else if (refY !== undefined) {
			if (
				[ReferencePoint.middleLeft, ReferencePoint.center, ReferencePoint.middleRight].includes(
					rect.referencePoint
				)
			) {
				rect.height = 2 * (ui.mouse.y - refY);
			} else if (
				[ReferencePoint.leftUpper, ReferencePoint.middleUpper, ReferencePoint.rightUpper].includes(
					rect.referencePoint
				)
			) {
				rect.height = refY - ui.mouse.y;
			} else {
				rect.height = ui.mouse.y - refY;
			}
		}
	});

	onMount(() => {
		const contentElm = myCanvas.svg.node();

		if (!contentElm) return;

		const handleClick = () => {
			if (refX === undefined) {
				refX = Number(rect.refX.toFixed(3));
			} else if (width === undefined) {
				width = Number(rect.width.toFixed(3));
			}

			if (refY === undefined) {
				refY = Number(rect.refY.toFixed(3));
			} else if (height === undefined) {
				height = Number(rect.height.toFixed(3));
			}

			createShape();
		};

		contentElm.addEventListener("click", handleClick);

		// Optionally remove the listener on component unmount
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
				myCanvas.newShape.shape.countourPoints.forEach((point) => (point.isMagnet = true));
				myCanvas.shapes.push(myCanvas.newShape.shape);

				// Clean and start creating new shape
				refX = undefined;
				refY = undefined;
				width = undefined;
				height = undefined;
				myCanvas.newShape.createNew(new Rectangle(0, 0, 0, 0));
			}
		},
		closeMenu = () => {
			myCanvas.newShape.clean();
		};
</script>

{#snippet marker(refPoint: ReferencePoint, cx: number, cy: number, r: number)}
	<circle
		class={cn("point point-hoverable", rect.referencePoint == refPoint ? "point-selected" : "")}
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
		</svg>
	</div>

	<div class="flex w-full flex-row gap-2">
		<div class="flex-1 flex-col gap-1.5">
			<Label for="width">Width, in</Label>
			<Input
				type="number"
				id="width"
				bind:value={width}
				placeholder={refX !== undefined ? rect.width.toFixed(2) : "width"} />
		</div>

		<div class="flex-1 flex-col gap-1.5">
			<Label for="height">Height, in</Label>
			<Input
				type="number"
				id="height"
				bind:value={height}
				placeholder={refY !== undefined ? rect.height.toFixed(2) : "height"} />
		</div>
	</div>

	<div class="flex w-full flex-row gap-2">
		<div class="flex-1 flex-col gap-1.5">
			<Label for="x_loc">X loc, in</Label>
			<Input type="number" id="x_loc" bind:value={refX} placeholder={rect.refX.toFixed(2)} />
		</div>

		<div class="flex-1 flex-col gap-1.5">
			<Label for="y_loc">Y loc, in</Label>
			<Input type="number" id="y_loc" bind:value={refY} placeholder={rect.refY.toFixed(2)} />
		</div>
	</div>

	<div class="flex w-full items-center space-x-2">
		<Checkbox id="is_hole" bind:checked={rect.isHole} />
		<Label for="is_hole">Is Hole</Label>
	</div>

	<div class="flex flex-row justify-end gap-2">
		<Button onclick={createShape}>Create</Button>
		<Button variant="secondary" onclick={closeMenu}>Cancel</Button>
	</div>
</Card.Root>

<svelte:window onkeydown={onKeyDown} />
