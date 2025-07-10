<script lang="ts">
	// Import UI primitives and utilities (dropdowns, toggles, tooltips, cards, separators, button styles)
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Toggle } from "$lib/components/ui/toggle/index.js";
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";

	// Import icon components for toolbar actions
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
	} from "@lucide/svelte";

	// Import canvas state and shape classes
	import { myCanvas } from "$lib/runes/canvas.svelte.js";
	import { Rectangle } from "$lib/canvas/shapes/Rectangle/rune.svelte.js";
	import { Circle } from "$lib/canvas/shapes/Circle/rune.svelte.js";
	import { Polygon } from "$lib/canvas/shapes/Polygon/rune.svelte.js";
	import { Measure } from "$lib/canvas/measure/rune.svelte.js";

	// Function to create a new shape on the canvas
	const createNewShape = (shepe: "rectangle" | "circle" | "polygon" | "measure") => {
		// Clear edited shape
		myCanvas.editShape = undefined;

		// Set new shape
		switch (shepe) {
			case "rectangle":
				myCanvas.newShape = new Rectangle(0, 0, {});
				break;
			case "circle":
				myCanvas.newShape = new Circle(0, 0, 0);
				break;
			case "polygon":
				myCanvas.newShape = new Polygon([{ x: 0, y: 0 }]);
				break;
			case "measure":
				myCanvas.newShape = new Measure();
				break;
		}
	};
</script>

<!-- Toolbar card containing shape creation, view, and mode toggles -->
<Card.Root
	class="pointer-events-auto flex flex-row items-center justify-between gap-2 rounded-md p-1">
	<!-- Dropdown for creating new shapes -->
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<!-- Use snipped to avoid <button> inside <button -->
			{#snippet child({ props })}
				<div {...props}>
					<Tooltip.Root>
						<Tooltip.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })}>
							<DiamondPlus />
						</Tooltip.Trigger>

						<Tooltip.Content>
							<p>Create new shape</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			{/snippet}
		</DropdownMenu.Trigger>

		<DropdownMenu.Content>
			<!-- Rectangle shape option -->
			<DropdownMenu.Item onclick={() => createNewShape("rectangle")}>
				<Square class="mr-2 size-4" />
				<span>Rectangle</span>
			</DropdownMenu.Item>
			<!-- Circle shape option -->
			<DropdownMenu.Item onclick={() => createNewShape("circle")}>
				<CircleIcon class="mr-2 size-4" />
				<span>Circle</span>
			</DropdownMenu.Item>
			<!-- Polygon shape option -->
			<DropdownMenu.Item onclick={() => createNewShape("polygon")}>
				<Waypoints class="mr-2 size-4" />
				<span>Polygon</span>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<!-- Button for creating a new measurement -->
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

	<!-- Button to fit the canvas view to all objects -->
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

	<!-- Toggle group for switching between move and resize modes -->
	<ToggleGroup.Root
		class="gap-2"
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
		<!-- Move mode toggle -->
		<Tooltip.Root>
			<Tooltip.Trigger>
				<!-- Use snipped to avoid <button> inside <button -->
				{#snippet child({ props })}
					<div {...props}>
						<ToggleGroup.Item
							class={buttonVariants({ variant: "ghost", size: "icon" })}
							value="move">
							<Move />
						</ToggleGroup.Item>
					</div>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Move mode</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<!-- Resize mode toggle -->
		<Tooltip.Root>
			<Tooltip.Trigger>
				<!-- Use snipped to avoid <button> inside <button -->
				{#snippet child({ props })}
					<div {...props}>
						<ToggleGroup.Item
							class={buttonVariants({ variant: "ghost", size: "icon" })}
							value="resize">
							<MoveDiagonal />
						</ToggleGroup.Item>
					</div>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Resize mode</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</ToggleGroup.Root>

	<Separator orientation="vertical" />

	<!-- Toggle to show/hide grid -->
	<Tooltip.Root>
		<Tooltip.Trigger>
			<!-- Use snipped to avoid <button> inside <button -->
			{#snippet child({ props })}
				<div {...props}>
					<Toggle bind:pressed={myCanvas.uiOptions.showGrid}><Grid3x3 /></Toggle>
				</div>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Toggle Grid</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<!-- Toggle to enable/disable snap to grid -->
	<Tooltip.Root>
		<Tooltip.Trigger>
			<!-- Use snipped to avoid <button> inside <button -->
			{#snippet child({ props })}
				<div {...props}>
					<Toggle bind:pressed={myCanvas.uiOptions.magnet}><Magnet /></Toggle>
				</div>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Toggle Snap to Grid</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<!-- Toggle to show/hide cross section calculation results -->
	<Tooltip.Root>
		<Tooltip.Trigger>
			<!-- Use snipped to avoid <button> inside <button -->
			{#snippet child({ props })}
				<div {...props}>
					<Toggle bind:pressed={myCanvas.uiOptions.showResults}><Calculator /></Toggle>
				</div>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Show cross section calculation</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Card.Root>
