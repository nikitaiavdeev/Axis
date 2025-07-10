<script lang="ts">
	// Import top-level menu components
	import FileMenu from "./menus/FileMenu.svelte";
	import LightDarkMode from "./menus/LightDarkMode.svelte";
	import Zoom from "./menus/Zoom.svelte";
	import MouseInfo from "./menus/MouseInfo.svelte";
	import TopToolBar from "./menus/TopToolBar.svelte";

	// Import canvas state
	import { myCanvas } from "$lib/runes/canvas.svelte";

	// Import shape classes and their forms
	import { Rectangle } from "$lib/canvas/shapes/Rectangle/rune.svelte";
	import RectangleForm from "$lib/canvas/shapes/Rectangle/RectangleForm.svelte";
	import { Circle } from "$lib/canvas/shapes/Circle/rune.svelte";
	import CircleForm from "$lib/canvas/shapes/Circle/CircleForm.svelte";
	import { Polygon } from "$lib/canvas/shapes/Polygon/rune.svelte";
	import PolygonForm from "$lib/canvas/shapes/Polygon/PolygonForm.svelte";
	import { Measure } from "$lib/canvas/measure/rune.svelte";
	import MeasureForm from "$lib/canvas/measure/MeasureForm.svelte";
	import { Point } from "$lib/canvas/point/rune.svelte";
	import PointForm from "$lib/canvas/point/PointForm.svelte";
</script>

<!-- Main container for all menus, positioned absolutely over the canvas -->
<div
	class="pointer-events-none relative z-10 flex h-full w-full flex-col justify-between gap-2 p-4">
	<!-- Top menus: File, toolbar, and light/dark mode toggle -->
	<div class="not-only:items-top pointer-events-none flex justify-between gap-2">
		<FileMenu />
		<TopToolBar />
		<LightDarkMode />
	</div>

	<!-- Contextual form for the currently active shape on the canvas -->
	<div class="pointer-events-none flex items-center justify-between">
		{#if myCanvas.activeShape instanceof Rectangle}
			<!-- Show Rectangle form if active shape is a Rectangle -->
			<RectangleForm shape={myCanvas.activeShape} />
		{:else if myCanvas.activeShape instanceof Circle}
			<!-- Show Circle form if active shape is a Circle -->
			<CircleForm shape={myCanvas.activeShape} />
		{:else if myCanvas.activeShape instanceof Polygon}
			<!-- Show Polygon form if active shape is a Polygon -->
			<PolygonForm shape={myCanvas.activeShape} />
		{:else if myCanvas.activeShape instanceof Measure}
			<!-- Show Measure form if active shape is a Measure -->
			<MeasureForm measure={myCanvas.activeShape} />
		{:else if myCanvas.activeShape instanceof Point}
			<!-- Show Point form if active shape is a Point -->
			<PointForm point={myCanvas.activeShape} />
		{/if}
	</div>

	<!-- Bottom menus: Zoom and mouse info -->
	<div class="pointer-events-none flex items-center justify-between">
		<div class="flex flex-row items-center gap-2">
			<Zoom />
			<MouseInfo />
		</div>
	</div>

	<!-- Results panel (currently commented out) -->
	<!-- {#if myCanvas.uiOptions.showResults}
				<Results></Results>
			{/if} -->
</div>
