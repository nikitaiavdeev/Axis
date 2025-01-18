<script lang="ts">
	// Icons
	import { Minus, Plus } from "lucide-svelte";

	// Runes
	import { ui } from "$lib/runes/ui.svelte.js";

	// UI
	import { buttonVariants } from "../ui/button/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { cn } from "$lib/utils.js";
</script>

<Tooltip.Provider>
	<div class="absolute bottom-4 left-4 inline-flex items-center justify-center">
		<div
			class="inline-flex items-center justify-center rounded-md border border-input bg-background shadow-md">
			<Tooltip.Root>
				<Tooltip.Trigger
					class={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-none")}
					onclick={() => {
						ui.options.position.zoom -= 0.1;
					}}>
					<Minus />
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Zoom out ⌘-</p>
				</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root>
				<Tooltip.Trigger
					class={cn(buttonVariants({ variant: "ghost" }), "rounded-none w-[60px]")}
					onclick={() => {
						ui.options.position.zoom = 1;
					}}>
					{Math.floor(ui.options.position.zoom * 100)}%</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Reset zoom</p>
				</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root>
				<Tooltip.Trigger
					class={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-none")}
					onclick={() => {
						ui.options.position.zoom += 0.1;
					}}>
					<Plus />
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Zoom in ⌘+</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>

		<div class="ms-4 rounded-md border border-input bg-background shadow-md">
			<div class="inline-flex h-9 w-[130px] items-center ps-4 py-2">
				x: {ui.mouse.x.toFixed(2)} in
			</div>
			<div class="inline-flex h-9 w-[130px] items-center pe-4 py-2">
				y: {ui.mouse.y.toFixed(2)} in
			</div>
		</div>
	</div>
</Tooltip.Provider>
