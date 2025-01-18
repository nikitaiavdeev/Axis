<script lang="ts">
	// UI
	import { Toaster } from "svelte-sonner";
	import FileMenu from "$lib/components/interface/FileMenu.svelte";
	import LightDarkMode from "$lib/components/interface/LightDarkMode.svelte";
	import MouseInfo from "$lib/components/interface/MouseInfo.svelte";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";

	// Light/Dark theme
	import { ModeWatcher } from "mode-watcher";

	// IndexedDB
	import { myIndexedDB } from "$lib/scripts/indexedDB/index.svelte";

	import "../app.css";
	let { children } = $props();
</script>

<!-- Light/Dark theme -->
<ModeWatcher></ModeWatcher>

{#await myIndexedDB.init() then}
	<!-- Interface -->
	<FileMenu></FileMenu>
	<LightDarkMode></LightDarkMode>
	<MouseInfo></MouseInfo>

	{@render children()}
{/await}

<Toaster />
