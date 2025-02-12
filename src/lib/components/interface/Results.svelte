<script lang="ts">
	// UI
	import * as Card from "$lib/components/ui/card/index.js";
	import { myCanvas } from "$lib/runes/canvas.svelte";

	const properties = $derived.by(() => {
		const properties = {
			area: 0,
			cX: 0,
			cY: 0,
			iX: 0,
			iY: 0,
			iXY: 0,
		};

		for (const shape of myCanvas.shapes) {
			properties.area += shape.properties.area;
			properties.cX += shape.properties.cX * shape.properties.area;
			properties.cY += shape.properties.cY * shape.properties.area;
		}
		properties.cX /= properties.area;
		properties.cY /= properties.area;

		for (const shape of myCanvas.shapes) {
			const dX = properties.cX - shape.properties.cX,
				dY = properties.cY - shape.properties.cY;

			properties.iX += shape.properties.iX + shape.properties.area * dY ** 2;
			properties.iY += shape.properties.iY + shape.properties.area * dX ** 2;
			properties.iXY += shape.properties.iXY + shape.properties.area * dX * dY;
		}

		return properties;
	});
</script>

<Card.Root
	class="absolute right-4 top-1/3 inline-flex w-[280px] -translate-y-1/2 flex-col gap-y-4 rounded-md p-4">
	<p>{properties.area}</p>
	<p>{properties.cX}</p>
	<p>{properties.cY}</p>
	<p>{properties.iX}</p>
	<p>{properties.iY}</p>
	<p>{properties.iXY}</p>
</Card.Root>
