<script lang="ts">
	// Import SunMoon icon for the toggle button
	import { SunMoon } from "@lucide/svelte";

	// Import theme toggle function
	import { toggleMode } from "mode-watcher";

	// Import UI primitives and utilities
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>

<!-- Card container for the theme toggle button -->
<Card.Root class="pointer-events-auto self-start rounded-md p-0">
	<Tooltip.Root>
		<!-- Button to toggle light/dark mode, wrapped in a tooltip -->
		<Tooltip.Trigger
			class={buttonVariants({ variant: "ghost", size: "icon" })}
			onclick={toggleMode}>
			<SunMoon class="size-4" />
		</Tooltip.Trigger>
		<!-- Tooltip content shown on hover -->
		<Tooltip.Content>
			<p>Toggle Theme</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Card.Root>
