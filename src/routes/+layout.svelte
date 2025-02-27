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
	import { myIndexedDB } from "$lib/scripts/indexedDB.svelte";

	// Global Events
	import { keyPressEvent, onWheel, onMouseMove, onMouseUp } from "$lib/scripts/globalEvents";

	import "../app.css";
	import { onMount } from "svelte";
	import { myCanvas } from "$lib/runes/canvas.svelte";

	// Shapes
	import { Rectangle } from "$lib/canvas/shapes/Rectangle/rune.svelte";
	import RectangleForm from "$lib/canvas/shapes/Rectangle/RectangleForm.svelte";
	import { Circle } from "$lib/canvas/shapes/Circle/rune.svelte";
	import CircleForm from "$lib/canvas/shapes/Circle/CircleForm.svelte";
	// import { Polygon } from "$lib/canvas/shapes/Polygon/rune.svelte";
	// import NewPolygon from "$lib/canvas/shapes/Polygon/NewPolygon.svelte";
	// import { Measure } from "$lib/canvas/measure/rune.svelte";
	// import NewMeasure from "$lib/canvas/measure/NewMeasure.svelte";
	import Results from "$lib/components/interface/Results.svelte";

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

		{#if myCanvas.uiOptions.showResults}
			<Results></Results>
		{/if}

		{#if myCanvas.activeElement instanceof Rectangle}
			<RectangleForm shape={myCanvas.activeElement} />
		{:else if myCanvas.activeElement instanceof Circle}
			<CircleForm shape={myCanvas.activeElement} />
			<!-- {:else if myCanvas.newShape.shape instanceof Polygon}
			<NewPolygon shape={myCanvas.newShape.shape} />
		{:else if myCanvas.activeElement instanceof Measure}
			<NewMeasure shape={myCanvas.activeElement} /> -->
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
