<script lang="ts">
	// UI
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button/index.js";

	// Rune
	import { ui } from "$lib/runes/ui.svelte";

	const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeMenu();
			}
		},
		closeMenu = () => {
			ui.showMenu = undefined;
		};
</script>

<Card.Root
	class="absolute left-4 top-1/2 inline-flex w-[280px] -translate-y-1/2 flex-col gap-y-4 rounded-md p-4">
	<div class="flex flex-col gap-1.5">
		<Label for="reference_points">Reference Point</Label>
		<svg class="w-full" id="reference_points" width="100" height="100" viewBox="0 0 100 100">
			<rect class="shape" x="10" y="10" width="80" height="80"></rect>

			<!-- Lower Left -->
			<circle class="point" cx={10} cy={90} r={6}></circle>
			<!-- Middle Left -->
			<circle class="point" cx={10} cy={50} r={4}></circle>
			<!-- Upper Left -->
			<circle class="point" cx={10} cy={10} r={6}></circle>
			<!-- Middle Upper -->
			<circle class="point" cx={50} cy={10} r={4}></circle>
			<!-- Upper Right -->
			<circle class="point" cx={90} cy={10} r={6}></circle>
			<!-- Middle Right -->
			<circle class="point" cx={90} cy={50} r={4}></circle>
			<!-- Lower Right -->
			<circle class="point" cx={90} cy={90} r={6}></circle>
			<!-- Middle Lower -->
			<circle class="point" cx={50} cy={90} r={4}></circle>

			<!-- Center -->
			<circle class="point" cx={50} cy={50} r={6}></circle>
		</svg>
	</div>

	<div class="flex w-full flex-row gap-2">
		<div class="flex-1 flex-col gap-1.5">
			<Label for="width">Width, in</Label>
			<Input type="number" id="width" placeholder="width" />
		</div>

		<div class="flex-1 flex-col gap-1.5">
			<Label for="height">Height, in</Label>
			<Input type="number" id="height" placeholder="height" />
		</div>
	</div>

	<div class="flex w-full flex-row gap-2">
		<div class="flex-1 flex-col gap-1.5">
			<Label for="x_loc">X loc, in</Label>
			<Input type="number" id="x_loc" placeholder="x location" />
		</div>

		<div class="flex-1 flex-col gap-1.5">
			<Label for="y_loc">Y loc, in</Label>
			<Input type="number" id="y_loc" placeholder="y location" />
		</div>
	</div>

	<div class="flex flex-row justify-end gap-2">
		<Button>Create</Button>
		<Button variant="secondary" onclick={closeMenu}>Cancel</Button>
	</div>
</Card.Root>

<svelte:window onkeydown={onKeyDown} />
