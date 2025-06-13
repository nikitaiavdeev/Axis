<script lang="ts">
	// Icons
	import { Minus, Plus } from "@lucide/svelte";

	// Runes
	import { myCanvas } from "$lib/runes/canvas.svelte.js";

	// UI
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { cn } from "$lib/utils.js";
</script>

<Card.Root
	class="pointer-events-auto flex flex-row items-center justify-between gap-2 rounded-sm p-1">
	<Tooltip.Root>
		<Tooltip.Trigger
			class={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
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
			class={cn(buttonVariants({ variant: "ghost" }), "w-[60px]")}
			onclick={() => {
				myCanvas.resetZoom();
			}}>
			{Math.floor(myCanvas.scale * 100)}%
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Reset zoom</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<Tooltip.Root>
		<Tooltip.Trigger
			class={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
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
