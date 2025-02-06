<script lang="ts">
	// UI
	import { Toaster } from "svelte-sonner";
	import FileMenu from "$lib/components/interface/FileMenu.svelte";
	import LightDarkMode from "$lib/components/interface/LightDarkMode.svelte";
	import MouseInfo from "$lib/components/interface/MouseInfo.svelte";
	import TopToolBar from "$lib/components/interface/TopToolBar.svelte";

	// Light/Dark theme
	import { ModeWatcher } from "mode-watcher";

	// IndexedDB
	import { myIndexedDB } from "$lib/scripts/indexedDB/index.svelte";

	// Global Events
	import { keyPressEvent, onWheel, onMouseMove } from "$lib/scripts/globalEvents";

	import "../app.css";
	import { onMount } from "svelte";
	import NewRectangle from "$lib/components/canvas/shapes/Rectangle/NewRectangle.svelte";
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Rectangle } from "$lib/components/canvas/shapes/Rectangle/rune.svelte";

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
<TopToolBar></TopToolBar>

{#await myIndexedDB.init() then}
	<!-- Interface -->
	<FileMenu></FileMenu>
	<LightDarkMode></LightDarkMode>
	<MouseInfo></MouseInfo>

	{#if myCanvas.newShape.shape instanceof Rectangle}
		<NewRectangle rect={myCanvas.newShape.shape} />
	{/if}

	{@render children()}
{/await}

<Toaster />

<!-- Global event listeners -->
<svelte:window
	onmousemove={(event) => onMouseMove(event)}
	onwheel={(event) => onWheel(event)}
	onkeydown={(event) => keyPressEvent(event)} />
