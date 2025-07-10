<script lang="ts">
	// Icons
	import { Trash2 } from "@lucide/svelte";

	// UI components
	import ShapeForm from "$lib/canvas/shapes/ShapeForm.svelte";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { cn } from "$lib/utils.js";

	// Rune (canvas logic)
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Rectangle } from "./rune.svelte";
	import { Point } from "$lib/canvas/point/rune.svelte";

	// Props: Rectangle shape instance
	let { shape }: { shape: Rectangle } = $props();

	// Reference to ShapeForm instance
	let shapeForm = $state<ShapeForm>();

	// State for user input fields (reference point, width, height)
	let refX = $state<number | undefined>(undefined),
		refY = $state<number | undefined>(undefined),
		width = $state<number | undefined>(undefined),
		height = $state<number | undefined>(undefined);

	// Effect: Update placeholders when rectangle changes
	$effect(() => {
		// Uncomment to update input placeholders when editing shape
		// refX = Number(shape.referencePoint.x.toFixed(4));
		// refY = Number(shape.referencePoint.y.toFixed(4));
		// width = Number(shape.width.toFixed(4));
		// height = Number(shape.height.toFixed(4));
	});

	// Effect: Update shape properties based on user input or mouse movement
	$effect(() => {
		// Uncomment to sync mouse magnet with input values
		// myCanvas.mouse.magnetX = refX;
		// myCanvas.mouse.magnetY = refY;
		// if (refX !== undefined && refY !== undefined) clickHandle();
	});

	$effect(() => {
		// Placeholder for additional effects on width/height change
	});

	// Handle click to set reference point or dimensions
	const clickHandle = () => {
		if (refX === undefined) {
			refX = Number(shape.referencePoint.x.toFixed(4));
		} else if (width === undefined) {
			width = Number(shape.width.toFixed(4));
		}

		if (refY === undefined) {
			refY = Number(shape.referencePoint.y.toFixed(4));
		} else if (height === undefined) {
			height = Number(shape.width.toFixed(4));
		}

		// If dimensions are missing, set editedPoint for further editing
		if (width === undefined || height === undefined) {
			shape.editedPoint = shape.oppositePoint();
		}

		createShapeCallback();
	};

	// Create shape and reset form for new shape creation
	const createShapeCallback = () => {
		if (refX !== undefined && refY !== undefined && width !== undefined && height !== undefined) {
			// Register new shape
			shape.editedPoint = undefined;
			myCanvas.shapes.push(shape);

			// Reset input fields
			refX = undefined;
			refY = undefined;
			width = undefined;
			height = undefined;

			// Prepare a new Rectangle with previous parameters
			myCanvas.newShape = new Rectangle(0, 0, {
				referencePoint: shape.referencePoint.name as keyof typeof shape.points,
				isHole: shape.isHole,
			});
		}
	};
</script>

{#snippet marker(refPoint: Point, cx: number, cy: number, r: number)}
	<!-- SVG marker for reference points -->
	<circle
		class={cn("point hoverable", shape.referencePoint == refPoint ? "selected" : "")}
		role="none"
		shape-rendering="geometricPrecision"
		{cx}
		{cy}
		{r}
		onclick={() => {
			shape.referencePoint = refPoint;
		}}>
	</circle>
{/snippet}

<!-- Main shape form UI -->
<ShapeForm bind:this={shapeForm} element={shape} {createShapeCallback} {clickHandle}>
	<div class="flex flex-col gap-1.5">
		<Label>Reference Point</Label>
		<!-- SVG preview of rectangle with selectable reference points -->
		<svg class="w-full" width="100" height="100" viewBox="0 0 100 100">
			<g class:hole={shape.isHole}>
				<rect class="shape" x="10" y="10" width="80" height="80"></rect>

				<!-- Render all possible reference points as markers -->
				{@render marker(shape.points.leftLower, 10, 90, 6)}
				{@render marker(shape.points.middleLeft, 10, 50, 4)}
				{@render marker(shape.points.leftUpper, 10, 10, 6)}
				{@render marker(shape.points.middleUpper, 50, 10, 4)}
				{@render marker(shape.points.rightUpper, 90, 10, 6)}
				{@render marker(shape.points.middleRight, 90, 50, 4)}
				{@render marker(shape.points.rightLower, 90, 90, 6)}
				{@render marker(shape.points.middleLower, 50, 90, 4)}
				{@render marker(shape.points.center, 50, 50, 6)}
			</g>
		</svg>
	</div>

	<!-- Input fields for X and Y location -->
	<div class="flex w-full flex-row gap-2">
		<div class="flex flex-col gap-1.5">
			<Label for="x_loc">X loc, in</Label>
			<Input
				type="number"
				id="x_loc"
				bind:value={refX}
				placeholder={shape.referencePoint.x.toFixed(3)} />
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="y_loc">Y loc, in</Label>
			<Input
				type="number"
				id="y_loc"
				bind:value={refY}
				placeholder={shape.referencePoint.y.toFixed(3)} />
		</div>
	</div>

	<!-- Input fields for width and height -->
	<div class="flex w-full flex-row gap-2">
		<div class="flex flex-col gap-1.5">
			<Label for="width">Width, in</Label>
			<Input
				type="number"
				id="width"
				bind:value={width}
				placeholder={refX !== undefined ? shape.width.toFixed(3) : "width"} />
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="height">Height, in</Label>
			<Input
				type="number"
				id="height"
				bind:value={height}
				placeholder={refY !== undefined ? shape.height.toFixed(3) : "height"} />
		</div>
	</div>

	<!-- Checkbox for "Is Hole" property -->
	<div class="flex w-full items-center space-x-2">
		<Checkbox id="is_hole" bind:checked={shape.isHole} />
		<Label for="is_hole">Is Hole</Label>
	</div>

	<!-- Action buttons: Create, Delete, Cancel -->
	<div class="flex flex-row gap-2">
		{#if myCanvas.newShape}
			<Button class="grow" onclick={() => createShapeCallback()}>Create</Button>
		{:else}
			<Button class="grow" variant="destructive" onclick={() => shapeForm!.deleteShape()}>
				<Trash2 />Delete
			</Button>
		{/if}
		<Button class="grow" variant="secondary" onclick={() => shapeForm!.closeMenu()}>Cancel</Button>
	</div>
</ShapeForm>
