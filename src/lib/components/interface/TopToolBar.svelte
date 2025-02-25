<script lang="ts">
	// UI
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Toggle } from "$lib/components/ui/toggle/index.js";
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { buttonVariants } from "../ui/button/index.js";

	// Icons
	import {
		DiamondPlus,
		Move,
		Grid3x3,
		Magnet,
		MoveDiagonal,
		Square,
		Circle as CircleIcon,
		Calculator,
		Waypoints,
		Expand,
		Ruler,
	} from "lucide-svelte";

	// Runes
	import { myCanvas } from "$lib/runes/canvas.svelte.js";
	import { Rectangle } from "../../canvas/shapes/Rectangle/rune.svelte.js";
	import { Circle } from "../../canvas/shapes/Circle/rune.svelte.js";
	import { Polygon } from "../../canvas/shapes/Polygon/rune.svelte.js";
	import { Measure } from "$lib/canvas/measure/rune.svelte.js";

	const createNewShape = (shepe: "rectangle" | "circle" | "polygon" | "measure") => {
		switch (shepe) {
			case "rectangle":
				myCanvas.activeElement = new Rectangle(0, 0, 0, 0);
				break;
			case "circle":
				myCanvas.activeElement = new Circle(0, 0, 0);
				break;
			case "polygon":
				myCanvas.activeElement = new Polygon([{ x: 0, y: 0 }]);
				break;
			case "measure":
				myCanvas.activeElement = new Measure();
				break;
		}
		myCanvas.activeElementMode = "new";
	};
</script>

<Card.Root class="absolute left-1/2 top-4 inline-flex -translate-x-1/2 gap-x-1 rounded-md p-1">
	<Tooltip.Root>
		<Tooltip.Trigger>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })}>
					<DiamondPlus />
				</DropdownMenu.Trigger>

				<DropdownMenu.Content>
					<DropdownMenu.Item onclick={() => createNewShape("rectangle")}>
						<Square class="mr-2 size-4" />
						<span>Rectangle</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={() => createNewShape("circle")}>
						<CircleIcon class="mr-2 size-4" />
						<span>Circle</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={() => createNewShape("polygon")}>
						<Waypoints class="mr-2 size-4" />
						<span>Polygon</span>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Create new shape</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<Tooltip.Root>
		<Tooltip.Trigger
			class={buttonVariants({ variant: "ghost", size: "icon" })}
			onclick={() => createNewShape("measure")}>
			<Ruler />
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Create new measurment</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<Separator orientation="vertical" />

	<Tooltip.Root>
		<Tooltip.Trigger
			class={buttonVariants({ variant: "ghost", size: "icon" })}
			onclick={() => myCanvas.fitView()}>
			<Expand />
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Fit View ⌘F</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<Separator orientation="vertical" />

	<ToggleGroup.Root
		type="single"
		bind:value={
			() => myCanvas.uiOptions.editMode,
			(newValue: typeof myCanvas.uiOptions.editMode | "") => {
				if (newValue === "") {
					if (myCanvas.uiOptions.editMode === "move") {
						myCanvas.uiOptions.editMode = "resize";
					} else {
						myCanvas.uiOptions.editMode = "move";
					}
				} else {
					myCanvas.uiOptions.editMode = newValue;
				}
			}
		}>
		<Tooltip.Root>
			<Tooltip.Trigger>
				<ToggleGroup.Item value="move"><Move /></ToggleGroup.Item>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Move mode</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger>
				<ToggleGroup.Item value="resize"><MoveDiagonal /></ToggleGroup.Item>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Resize mode</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</ToggleGroup.Root>

	<Separator orientation="vertical" />

	<Tooltip.Root>
		<Tooltip.Trigger>
			<Toggle bind:pressed={myCanvas.uiOptions.showGrid}><Grid3x3 /></Toggle>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Toggle Grid</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<Tooltip.Root>
		<Tooltip.Trigger>
			<Toggle bind:pressed={myCanvas.uiOptions.magnet}><Magnet /></Toggle>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Toggle Snap to Grid</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<Tooltip.Root>
		<Tooltip.Trigger>
			<Toggle bind:pressed={myCanvas.uiOptions.showResults}><Calculator /></Toggle>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Show cross section calculation</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Card.Root>
