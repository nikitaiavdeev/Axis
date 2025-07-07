<script lang="ts">
	import { SunMoon } from "@lucide/svelte";

	import { toggleMode } from "mode-watcher";

	// UI
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>

<Card.Root class="pointer-events-auto self-start rounded-md p-0">
	<Tooltip.Root>
		<Tooltip.Trigger
			class={buttonVariants({ variant: "ghost", size: "icon" })}
			onclick={toggleMode}>
			<SunMoon class="size-4" />
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Toggle Theme</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Card.Root>
