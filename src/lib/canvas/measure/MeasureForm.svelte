<script lang="ts">
	// Icons
	import { Trash2, Ruler } from "lucide-svelte";

	// UI
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";

	// Rune
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Measure } from "./rune.svelte";
	import { onMount } from "svelte";

	let { measure }: { measure: Measure } = $props();
	let creationStage = $state("point1" as "point1" | "point2" | "point3");

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

	onMount(() => {
		const contentElm = myCanvas.svg.node();

		if (!contentElm) return;

		const handleClick = () => {
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
			}
		},
		deleteShape = () => {
			measure.remove();
			closeMenu();
		},
		closeMenu = () => {
			myCanvas.activeElement = undefined;
			myCanvas.activeElementMode = undefined;
		};
</script>

<Card.Root
	class="absolute left-4 top-1/3 inline-flex  -translate-y-1/2 flex-col gap-y-4 rounded-md p-4">
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
			<Button class="grow" variant="destructive" onclick={deleteShape}><Trash2 />Delete</Button>
		{/if}
		<Button class="grow" variant="secondary" onclick={closeMenu}>Cancel</Button>
	</div>
</Card.Root>

<svelte:window onkeydown={onKeyDown} />
