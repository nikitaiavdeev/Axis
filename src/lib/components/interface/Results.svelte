<script lang="ts">
	// UI
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Table from "$lib/components/ui/table/index.js";

	// Runes
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

		if (properties.area !== 0) {
			properties.cX /= properties.area;
			properties.cY /= properties.area;
		}

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
	class="absolute right-4 top-1/3 inline-flex -translate-y-1/2 flex-col gap-y-4 rounded-md p-4">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Parameter</Table.Head>
				<Table.Head>Value</Table.Head>
				<Table.Head>Units</Table.Head>
			</Table.Row>
		</Table.Header>

		<Table.Body>
			<Table.Row>
				<Table.Cell>Area</Table.Cell>
				<Table.Cell>{properties.area.toPrecision(4)}</Table.Cell>
				<Table.Cell>
					in
					<sup>2</sup>
				</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell>Centroid, X</Table.Cell>
				<Table.Cell>{properties.cX.toPrecision(4)}</Table.Cell>
				<Table.Cell>in</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell>Centroid, Y</Table.Cell>
				<Table.Cell>{properties.cY.toPrecision(4)}</Table.Cell>
				<Table.Cell>in</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell>
					Inertia, I
					<sub>x</sub>
				</Table.Cell>
				<Table.Cell>{properties.iX.toPrecision(4)}</Table.Cell>
				<Table.Cell>
					in
					<sup>4</sup>
				</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell>
					Inertia, I
					<sub>y</sub>
				</Table.Cell>
				<Table.Cell>{properties.iY.toPrecision(4)}</Table.Cell>
				<Table.Cell>
					in
					<sup>4</sup>
				</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell>
					Inertia, I
					<sub>xy</sub>
				</Table.Cell>
				<Table.Cell>{properties.iXY.toPrecision(4)}</Table.Cell>
				<Table.Cell>
					in
					<sup>4</sup>
				</Table.Cell>
			</Table.Row>
		</Table.Body>
	</Table.Root>
</Card.Root>
