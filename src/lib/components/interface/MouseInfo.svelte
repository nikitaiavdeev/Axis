<script lang="ts">
	// Icons
	import { Minus, Plus } from "lucide-svelte";

	// Runes
	import { ui } from "$lib/runes/ui.svelte.js";
	import { myCanvas } from "$lib/runes/canvas.svelte.js";

	// UI
	import { buttonVariants } from "../ui/button/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { cn } from "$lib/utils.js";
</script>

<Tooltip.Provider>
	<div class="absolute bottom-4 left-4 inline-flex items-center justify-center">
		<Card.Root class="inline-flex items-center justify-center rounded-md">
			<Tooltip.Root>
				<Tooltip.Trigger
					class={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-none")}
					onclick={() => {
						myCanvas.zoomOut();
					}}>
					<Minus />
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Zoom out ⌘-</p>
				</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root>
				<Tooltip.Trigger
					class={cn(buttonVariants({ variant: "ghost" }), "w-[60px] rounded-none")}
					onclick={() => {
						myCanvas.resetZoom();
					}}>
					{Math.floor(myCanvas.scale * 100)}%</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Reset zoom</p>
				</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root>
				<Tooltip.Trigger
					class={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-none")}
					onclick={() => {
						myCanvas.zoomIn();
					}}>
					<Plus />
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Zoom in ⌘+</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Card.Root>

		<Card.Root class="ms-4 inline-flex select-none items-center justify-center rounded-md">
			<div class="inline-flex h-9 w-[130px] items-center py-2 ps-4">
				x: {ui.mouse.x.toFixed(2)} in
			</div>
			<div class="inline-flex h-9 w-[130px] items-center py-2 pe-4">
				y: {ui.mouse.y.toFixed(2)} in
			</div>
		</Card.Root>
	</div>
</Tooltip.Provider>
