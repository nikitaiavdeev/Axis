<script lang="ts">
	// UI
	import { Button } from "$lib/components/ui/button/index.js";
	import { Toggle } from "$lib/components/ui/toggle/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";

	// Icons
	import { Grid3x3, Magnet } from "lucide-svelte";

	// Runes
	import { ui } from "$lib/runes/ui.svelte";
</script>

<Tooltip.Provider>
	<Card.Root class="absolute left-1/2 top-4 inline-flex -translate-x-1/2 gap-x-1 rounded-md p-1">
		<!-- Example Toggle -->
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Toggle bind:pressed={ui.options.showGrid}><Grid3x3 /></Toggle>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Toggle Grid</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger>
				<Toggle><Magnet /></Toggle>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Toggle Snap to Grid</p>
			</Tooltip.Content>
		</Tooltip.Root>

		<Separator orientation="vertical" />

		<Tooltip.Root>
			<Tooltip.Trigger>
				<Toggle><Magnet /></Toggle>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Toggle Snap to Grid</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</Card.Root>
</Tooltip.Provider>
