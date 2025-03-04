<script lang="ts">
	// Icons
	import { Trash2, Ruler } from "lucide-svelte";

	// UI
	import ShapeForm from "$lib/components/ui/ShapeForm.svelte";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";

	// Rune
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Measure } from "./rune.svelte";

	let { measure }: { measure: Measure } = $props();
	let creationStage = $state("point1" as "point1" | "point2" | "point3");

	// ShapeForm instance
	let shapeForm = $state<ShapeForm>();

	$effect(() => {
		if (myCanvas.activeElementMode === "new") {
			if (creationStage == "point1") {
				measure.points.point1.xResize(myCanvas.mouse.x);
				measure.points.point1.yResize(myCanvas.mouse.y);
			} else if (creationStage == "point2") {
				measure.points.point2.xResize(myCanvas.mouse.x);
				measure.points.point2.yResize(myCanvas.mouse.y);
			} else if (creationStage == "point3") {
				measure.points.point3.xResize(myCanvas.mouse.x);
				measure.points.point3.yResize(myCanvas.mouse.y);
			}
		}
	});

	const clickHandle = () => {
		if (creationStage == "point1") {
			creationStage = "point2";
		} else if (creationStage == "point2") {
			creationStage = "point3";
		} else if (creationStage == "point3") {
			// Register new shape
			myCanvas.measures.push(measure);

			// Clean and start creating new shape
			creationStage = "point1";

			myCanvas.activeElement = new Measure();
		}
	};
</script>

<ShapeForm bind:this={shapeForm} element={measure} createShapeCallback={clickHandle} {clickHandle}>
	<div class="flex flex-col gap-1.5">
		<Label>Measure Type</Label>

		<ToggleGroup.Root
			type="single"
			bind:value={
				() => measure.type,
				(newValue: "" | typeof measure.type) => {
					if (newValue !== "") {
						measure.type = newValue;
					}
				}
			}>
			<ToggleGroup.Item value="free">
				<Ruler />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="vertical">
				<Ruler class="rotate-45" />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="horizontal">
				<Ruler class=" -rotate-45" />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	</div>

	<div class="flex flex-row gap-2">
		{#if myCanvas.activeElementMode !== "new"}
			<Button class="grow" variant="destructive" onclick={() => shapeForm!.deleteShape()}>
				<Trash2 />Delete
			</Button>
		{/if}
		<Button class="grow" variant="secondary" onclick={() => shapeForm!.closeMenu()}>Cancel</Button>
	</div>
</ShapeForm>
