<script lang="ts">
	// UI
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";

	// Rune
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Rectangle, ReferencePoint } from "./rectangleRune.svelte";

	let { rect }: { rect: Rectangle } = $props();

	const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeMenu();
			} else if (event.key === "Enter") {
				createShape();
			}
		},
		createShape = () => {
			if (myCanvas.newShape) {
				myCanvas.shapes.push(myCanvas.newShape);
				myCanvas.newShape = undefined;
			}
		},
		closeMenu = () => {
			myCanvas.newShape = undefined;
		};
</script>

{#snippet marker(refPoint: ReferencePoint, cx: number, cy: number, r: number)}
	<circle
		class="point"
		class:selected={rect.referencePoint == refPoint}
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
		<Label for="reference_points">Reference Point</Label>
		<svg class="w-full" id="reference_points" width="100" height="100" viewBox="0 0 100 100">
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
			<Input type="number" id="width" bind:value={rect.width} placeholder="width" />
		</div>

		<div class="flex-1 flex-col gap-1.5">
			<Label for="height">Height, in</Label>
			<Input type="number" id="height" bind:value={rect.height} placeholder="height" />
		</div>
	</div>

	<div class="flex w-full flex-row gap-2">
		<div class="flex-1 flex-col gap-1.5">
			<Label for="x_loc">X loc, in</Label>
			<Input type="number" id="x_loc" bind:value={rect.refX} placeholder="x location" />
		</div>

		<div class="flex-1 flex-col gap-1.5">
			<Label for="y_loc">Y loc, in</Label>
			<Input type="number" id="y_loc" bind:value={rect.refY} placeholder="y location" />
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
