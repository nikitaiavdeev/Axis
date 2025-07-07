<script lang="ts">
	// Icons
	import { Trash2 } from "@lucide/svelte";

	// UI
	import ShapeForm from "$lib/canvas/shapes/ShapeForm.svelte";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";

	import { Button } from "$lib/components/ui/button/index.js";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { cn } from "$lib/utils.js";

	// Rune
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Point } from "./rune.svelte";

	let { point }: { point: Point } = $props();

	// ShapeForm instance
	let shapeForm = $state<ShapeForm>();

	// Placeholder values while user click screen or type manually
	let refX = $state<number | undefined>(undefined),
		refY = $state<number | undefined>(undefined);

	// Effect: Update placeholders when rectangle changes
	$effect(() => {
		// if (myCanvas.editShape) {
		// 	refX = Number(point.x.toFixed(4));
		// 	refY = Number(point.y.toFixed(4));
		// }
	});

	// Effect: Update shape properties based on user input or mouse movement
	$effect(() => {
		// if (myCanvas.uiOptions.editMode === "resize") {
		// 	point.xResize(Number(refX));
		// 	point.yResize(Number(refY));
		// 	return;
		// } else {
		// 	point.xMove(refX === undefined ? myCanvas.mouse.x : Number(refX));
		// 	point.yMove(refY === undefined ? myCanvas.mouse.y : Number(refY));
		// }
	});

	const clickHandle = () => {};
	const createShapeCallback = () => {};
</script>

<ShapeForm bind:this={shapeForm} element={point} {createShapeCallback} {clickHandle}>
	<div class="flex w-full flex-row gap-2">
		<div class="flex flex-col gap-1.5">
			<Label for="x_loc">X loc, in</Label>
			<Input type="number" id="x_loc" bind:value={refX} placeholder={point.x.toFixed(3)} />
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="y_loc">Y loc, in</Label>
			<Input type="number" id="y_loc" bind:value={refY} placeholder={point.y.toFixed(3)} />
		</div>
	</div>

	<div class="flex flex-row gap-2">
		{#if myCanvas.newShape}
			<Button class="grow" onclick={() => createShapeCallback()}>Create</Button>
		{/if}
		<Button class="grow" variant="secondary" onclick={() => shapeForm!.closeMenu()}>Cancel</Button>
	</div>
</ShapeForm>
