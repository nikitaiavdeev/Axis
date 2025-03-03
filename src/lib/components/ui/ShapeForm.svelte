<script lang="ts">
	// UI
	import * as Card from "$lib/components/ui/card/index.js";

	// Svelte
	import { onMount } from "svelte";
	import type { Snippet } from "svelte";

	// Rune
	import { myCanvas } from "$lib/runes/canvas.svelte";

	import type { Shape } from "$lib/canvas/shapes/index.svelte";
	import type { Measure } from "$lib/canvas/measure/rune.svelte";

	let {
		element,
		createShapeCallback,
		clickHandle,
		children,
	}: {
		element: Shape | Measure;
		createShapeCallback: () => void;
		clickHandle: () => void;
		children: Snippet;
	} = $props();

	onMount(() => {
		const contentElm = myCanvas.svg.node();

		if (!contentElm) return;

		const handleClick = () => {
			clickHandle();
			createShapeCallback();
		};

		if (myCanvas.activeElementMode === "new") {
			contentElm.addEventListener("click", handleClick);

			// Remove the listener on component unmount
			return () => {
				contentElm.removeEventListener("click", handleClick);
			};
		}
	});

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			closeMenu();
		} else if (event.key === "Enter") {
			createShapeCallback();
		}
	};

	export const deleteShape = () => {
			element.remove();
			closeMenu();
		},
		closeMenu = () => {
			myCanvas.activeElement = undefined;
			myCanvas.activeElementMode = undefined;
		};
</script>

<Card.Root
	class="absolute left-4 top-1/3 inline-flex w-[280px] -translate-y-1/2 flex-col gap-y-4 rounded-md p-4">
	{@render children?.()}
</Card.Root>

<svelte:window onkeydown={onKeyDown} />
