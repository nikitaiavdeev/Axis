<script lang="ts">
	// Import canvas state (for mouse coordinates)
	import { myCanvas } from "$lib/runes/canvas.svelte.js";

	// Import Card UI component
	import * as Card from "$lib/components/ui/card/index.js";
</script>

<!-- Card displaying the current mouse coordinates on the canvas -->
<Card.Root class="flex flex-row items-center justify-between gap-2 rounded-md p-1 select-none">
	<!-- X coordinate display -->
	<div class="inline-flex h-9 w-[110px] items-center py-2 ps-4">
		x: {myCanvas.mouse.x.toFixed(2)} in
	</div>
	<!-- Y coordinate display -->
	<div class="inline-flex h-9 w-[110px] items-center py-2 pe-4">
		y: {myCanvas.mouse.y.toFixed(2)} in
	</div>
</Card.Root>
