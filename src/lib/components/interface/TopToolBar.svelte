<script lang="ts">
	// UI
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Toggle } from "$lib/components/ui/toggle/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { buttonVariants } from "../ui/button/index.js";

	// Icons
	import { DiamondPlus, Grab, Grid3x3, Magnet, MousePointer, Square, Circle } from "lucide-svelte";

	// Runes
	import { ui } from "$lib/runes/ui.svelte";
</script>

<Tooltip.Provider>
	<Card.Root class="absolute left-1/2 top-4 inline-flex -translate-x-1/2 gap-x-1 rounded-md p-1">
		<Tooltip.Root>
			<Tooltip.Trigger>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })}
						><DiamondPlus /></DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Item onclick={() => (ui.showMenu = "CreateRectangle")}>
							<Square class="mr-2 size-4" />
							<span>Square</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<Circle class="mr-2 size-4" />
							<span>Circle</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Create new shape</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Separator orientation="vertical" />

		<Tooltip.Root>
			<Tooltip.Trigger>
				<Toggle bind:pressed={ui.options.showGrid}><Grab /></Toggle>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Move shape</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger>
				<Toggle bind:pressed={ui.options.showGrid}><MousePointer /></Toggle>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Move shape</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Separator orientation="vertical" />

		<Tooltip.Root>
			<Tooltip.Trigger>
				<Toggle bind:pressed={ui.options.showGrid}><Grid3x3 /></Toggle>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Toggle Grid</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger>
				<Toggle><Magnet /></Toggle>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Toggle Snap to Grid</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Separator orientation="vertical" />

		<Tooltip.Root>
			<Tooltip.Trigger>
				<Toggle><Magnet /></Toggle>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Toggle Snap to Grid</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</Card.Root>
</Tooltip.Provider>
