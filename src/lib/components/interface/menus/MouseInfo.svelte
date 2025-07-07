<script lang="ts">
	// Runes
	import { myCanvas } from "$lib/runes/canvas.svelte.js";

	// UI
	import * as Card from "$lib/components/ui/card/index.js";
</script>

<Card.Root class="flex flex-row items-center justify-between gap-2 rounded-md p-1 select-none">
	<div class="inline-flex h-9 w-[110px] items-center py-2 ps-4">
		x: {myCanvas.mouse.x.toFixed(2)} in
	</div>
	<div class="inline-flex h-9 w-[110px] items-center py-2 pe-4">
		y: {myCanvas.mouse.y.toFixed(2)} in
	</div>
</Card.Root>
