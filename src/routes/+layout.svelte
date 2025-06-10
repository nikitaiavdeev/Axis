<script lang="ts">
	// UI
	import { Toaster } from "svelte-sonner";
	import * as Tooltip from "$lib/components/ui/tooltip/index";

	// Interface components
	import Menus from "$lib/components/interface/Menus.svelte";
	import MainCanvas from "$lib/canvas/MainCanvas.svelte";

	// Light/Dark theme
	import { ModeWatcher } from "mode-watcher";

	// IndexedDB
	import { myIndexedDB } from "$lib/scripts/indexedDB.svelte";

	// Global Events
	import { keyPressEvent, onWheel, onMouseMove, onMouseUp } from "$lib/scripts/globalEvents";

	import { onMount } from "svelte";

	// Styles'
	import "$styles/app.css";
	import "$styles/canvas.css";
	import "$styles/shadcn.css";

	let { children } = $props();

	onMount(() => {
		document.addEventListener(
			"wheel",
			(event: MouseEvent) => {
				if (event.ctrlKey) {
					event.preventDefault();
				}
			},
			{ passive: false }
		);
	});
</script>

<!-- Light/Dark theme -->
<ModeWatcher></ModeWatcher>

<main class="@container h-screen w-screen overflow-auto">
	<Tooltip.Provider>
		<!-- Menus -->
		<Menus />

		{#await myIndexedDB.init() then}
			<MainCanvas />

			<!-- Page is empty -->
			{@render children?.()}
		{/await}
	</Tooltip.Provider>
</main>

<Toaster />

<!-- Global event listeners -->
<svelte:window
	onmousemove={(event) => onMouseMove(event)}
	onwheel={(event) => onWheel(event)}
	onkeydown={(event) => keyPressEvent(event)}
	onmouseup={(event) => onMouseUp(event)} />
