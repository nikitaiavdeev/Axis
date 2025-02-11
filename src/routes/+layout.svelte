<script lang="ts">
	// UI
	import { Toaster } from "svelte-sonner";
	import FileMenu from "$lib/components/interface/FileMenu.svelte";
	import LightDarkMode from "$lib/components/interface/LightDarkMode.svelte";
	import MouseInfo from "$lib/components/interface/MouseInfo.svelte";
	import TopToolBar from "$lib/components/interface/TopToolBar.svelte";
	import * as Tooltip from "$lib/components/ui/tooltip/index";

	// Light/Dark theme
	import { ModeWatcher } from "mode-watcher";

	// IndexedDB
	import { myIndexedDB } from "$lib/scripts/index.svelte";

	// Global Events
	import { keyPressEvent, onWheel, onMouseMove, onMouseUp } from "$lib/scripts/globalEvents";

	import "../app.css";
	import { onMount } from "svelte";
	import NewRectangle from "$lib/components/canvas/shapes/Rectangle/NewRectangle.svelte";
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Rectangle } from "$lib/components/canvas/shapes/Rectangle/rune.svelte";
	import { Circle } from "$lib/components/canvas/shapes/Circle/rune.svelte";
	import NewCircle from "$lib/components/canvas/shapes/Circle/NewCircle.svelte";

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

{#await myIndexedDB.init() then}
	<Tooltip.Provider>
		<!-- Interface -->
		<FileMenu></FileMenu>
		<LightDarkMode></LightDarkMode>
		<TopToolBar></TopToolBar>
		<MouseInfo></MouseInfo>

		{#if myCanvas.newShape.shape instanceof Rectangle}
			<NewRectangle shape={myCanvas.newShape.shape} />
		{:else if myCanvas.newShape.shape instanceof Circle}
			<NewCircle shape={myCanvas.newShape.shape} />
		{/if}

		{#if myCanvas.editShape.shape instanceof Rectangle}
			<NewRectangle shape={myCanvas.editShape.shape} />
		{:else if myCanvas.editShape.shape instanceof Circle}
			<NewCircle shape={myCanvas.editShape.shape} />
		{/if}

		{@render children()}
	</Tooltip.Provider>
{/await}

<Toaster />

<!-- Global event listeners -->
<svelte:window
	onmousemove={(event) => onMouseMove(event)}
	onwheel={(event) => onWheel(event)}
	onkeydown={(event) => keyPressEvent(event)}
	onmouseup={(event) => onMouseUp(event)} />
