<script lang="ts">
	import FileMenu from "./menus/FileMenu.svelte";
	import LightDarkMode from "./menus/LightDarkMode.svelte";
	import Zoom from "./menus/Zoom.svelte";
	import MouseInfo from "./menus/MouseInfo.svelte";
	import TopToolBar from "./menus/TopToolBar.svelte";

	import { myCanvas } from "$lib/runes/canvas.svelte";

	// Shapes
	import { Rectangle } from "$lib/canvas/shapes/Rectangle/rune.svelte";
	import RectangleForm from "$lib/canvas/shapes/Rectangle/RectangleForm.svelte";
	import { Circle } from "$lib/canvas/shapes/Circle/rune.svelte";
	import CircleForm from "$lib/canvas/shapes/Circle/CircleForm.svelte";
	import { Polygon } from "$lib/canvas/shapes/Polygon/rune.svelte";
	import PolygonForm from "$lib/canvas/shapes/Polygon/PolygonForm.svelte";
	import { Measure } from "$lib/canvas/measure/rune.svelte";
	import MeasureForm from "$lib/canvas/measure/MeasureForm.svelte";
</script>

<div
	class="pointer-events-none relative z-10 flex h-full w-full flex-col justify-between gap-2 p-4">
	<!-- Top menus-->
	<div class="not-only:items-top pointer-events-auto flex justify-between gap-2">
		<FileMenu />
		<TopToolBar />
		<LightDarkMode />
	</div>

	<div class="pointer-events-auto flex items-center justify-between">
		{#if myCanvas.activeElement instanceof Rectangle}
			<RectangleForm shape={myCanvas.activeElement} />
		{:else if myCanvas.activeElement instanceof Circle}
			<CircleForm shape={myCanvas.activeElement} />
		{:else if myCanvas.activeElement instanceof Polygon}
			<PolygonForm shape={myCanvas.activeElement} />
		{:else if myCanvas.activeElement instanceof Measure}
			<MeasureForm measure={myCanvas.activeElement} />
		{/if}
	</div>

	<!-- Bottom menus -->
	<div class="pointer-events-auto flex items-center justify-between">
		<div class="flex flex-row items-center gap-2">
			<Zoom />
			<MouseInfo />
		</div>
	</div>

	<!-- {#if myCanvas.uiOptions.showResults}
				<Results></Results>
			{/if} -->
</div>
