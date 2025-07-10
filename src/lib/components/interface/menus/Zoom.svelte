<script lang="ts">
	// Import zoom icons
	import { Minus, Plus } from "@lucide/svelte";

	// Import canvas state (for zoom controls)
	import { myCanvas } from "$lib/runes/canvas.svelte.js";

	// Import UI utilities and components
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { cn } from "$lib/utils.js";
</script>

<!-- Card containing zoom controls -->
<Card.Root
	class="pointer-events-auto flex flex-row items-center justify-between gap-2 rounded-sm p-1">
	<!-- Zoom out button with tooltip -->
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

	<!-- Reset zoom button with tooltip, shows current zoom percentage -->
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

	<!-- Zoom in button with tooltip -->
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
