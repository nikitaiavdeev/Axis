<script lang="ts">
	// Icons
	import { Trash2 } from "lucide-svelte";

	// UI
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";

	// Rune
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Polygon } from "./rune.svelte";
	import { onMount } from "svelte";

	let { shape }: { shape: Polygon } = $props();

	// Placeholder values while user click screen or type manually
	let refX = $state(undefined as undefined | number),
		refY = $state(undefined as undefined | number),
		dX = $state(undefined as undefined | number),
		dY = $state(undefined as undefined | number);

	const dXPlaceholder = $derived(
			shape.points.length > 1
				? (shape.points.at(-1)!.x - shape.points.at(-2)!.x).toFixed(3)
				: "Delta X"
		),
		dYPlaceholder = $derived(
			shape.points.length > 1
				? (shape.points.at(-1)!.y - shape.points.at(-2)!.y).toFixed(3)
				: "Delta Y"
		);

	// Effect if Placeholders been changed or mouse moved
	$effect(() => {
		if (myCanvas.activeElementMode === "new") {
			if (refX !== undefined) {
				shape.points.at(-1)!.xResize(Number(refX));
			} else {
				shape.points.at(-1)!.xResize(myCanvas.mouse.x);
			}

			if (refY !== undefined) {
				shape.points.at(-1)!.yResize(Number(refY));
			} else {
				shape.points.at(-1)!.yResize(myCanvas.mouse.y);
			}
		}
	});

	onMount(() => {
		const contentElm = myCanvas.svg.node();

		if (!contentElm) return;

		const handleClick = () => {
			if (
				shape.points.length > 1 &&
				shape.points.at(-1)!.x === shape.points[0].x &&
				shape.points.at(-1)!.y === shape.points[0].y
			) {
				createShape();
			} else {
				appendPoint();
			}
		};

		if (myCanvas.activeElementMode === "new") {
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
			} else if (event.key === "Enter") {
				appendPoint();
			}
		},
		appendPoint = () => {
			shape.appendPoint();
			refX = undefined;
			refY = undefined;
			dX = undefined;
			dY = undefined;
		},
		createShape = () => {
			if (shape.points.length > 3) {
				// Remove last point
				shape.points.at(-1)!.remove();
				shape.points.splice(shape.points.length - 1, 1);

				// Register new shape
				myCanvas.shapes.push(shape);

				// Clean and start creating new shape
				refX = undefined;
				refY = undefined;
				dX = undefined;
				dY = undefined;

				myCanvas.activeElement = new Polygon([{ x: 0, y: 0 }]);
			}
		},
		deleteShape = () => {
			shape.remove();
			closeMenu();
		},
		closeMenu = () => {
			myCanvas.activeElement = undefined;
			myCanvas.activeElementMode = undefined;
		};
</script>

<Card.Root
	class="absolute left-4 top-1/3 inline-flex w-[280px] -translate-y-1/2 flex-col gap-y-4 rounded-md p-4">
	<div class="flex w-full flex-row gap-2">
		<div class="flex-1 flex-col gap-1.5">
			<Label for="x_loc">X loc, in</Label>
			<Input
				type="number"
				id="x_loc"
				bind:value={refX}
				oninput={() => {
					dX = shape.points.at(-1)!.x - shape.points.at(-2)!.x;
				}}
				placeholder={shape.points.at(-1)!.x.toFixed(3)} />
		</div>

		<div class="flex-1 flex-col gap-1.5">
			<Label for="y_loc">Y loc, in</Label>
			<Input
				type="number"
				id="y_loc"
				bind:value={refY}
				placeholder={shape.points.at(-1)!.y.toFixed(3)} />
		</div>
	</div>

	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<Separator class="flex-1" orientation="horizontal" />
		</div>
		<div class="relative flex justify-center text-xs uppercase">
			<span class="bg-background text-muted-foreground">OR</span>
		</div>
	</div>

	<div class="flex w-full flex-row gap-2">
		<div class="flex-1 flex-col gap-1.5">
			<Label for="width">Delta X, in</Label>
			<Input
				type="number"
				id="width"
				bind:value={dX}
				oninput={() => {
					refX = shape.points.at(-2)!.x + dX!;
				}}
				disabled={shape.points.length === 0}
				placeholder={dXPlaceholder} />
		</div>

		<div class="flex-1 flex-col gap-1.5">
			<Label for="height">Delta Y, in</Label>
			<Input
				type="number"
				id="height"
				bind:value={dY}
				disabled={shape.points.length === 0}
				placeholder={dYPlaceholder} />
		</div>
	</div>

	<div class="flex w-full items-center space-x-2">
		<Checkbox id="is_hole" bind:checked={shape.isHole} />
		<Label for="is_hole">Is Hole</Label>
	</div>

	<div class="flex">
		{#if myCanvas.activeElementMode === "new"}
			<Button class="grow" onclick={() => appendPoint()}>Add Point</Button>
		{:else}
			<Button class="grow" onclick={() => appendPoint()}>Edit Point</Button>
		{/if}
	</div>

	<div class="flex flex-row gap-2">
		{#if myCanvas.activeElementMode === "new"}
			<Button class="grow" variant="secondary" onclick={() => createShape()}>Create</Button>
		{:else}
			<Button class="grow" variant="destructive" onclick={deleteShape}><Trash2 />Delete</Button>
		{/if}
		<Button class="grow" variant="secondary" onclick={closeMenu}>Cancel</Button>
	</div>
</Card.Root>

<svelte:window onkeydown={onKeyDown} />
