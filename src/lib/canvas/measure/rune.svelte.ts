import { myCanvas } from "$lib/runes/canvas.svelte";
import { Point } from "../point/rune.svelte";

export class Measure {
	type = $state("free" as "horizontal" | "vertical" | "free");
	point1 = $state({
		x: 0,
		y: 0,
	});
	point2 = $state({
		x: 0,
		y: 0,
	});
	point3 = $state({
		x: 0,
		y: 0,
	});

	points = {
		point1: new Point(
			() => this.point1.x,
			() => this.point1.y,
			this
		),
		point2: new Point(
			() => this.point2.x,
			() => this.point2.y,
			this
		),
		point3: new Point(
			() => this.point3.x,
			() => this.point3.y,
			this
		),
	};

	constructor() {}

	clean() {
		// Delete shape
		const idx = myCanvas.measures.findIndex((m) => m === this);
		if (idx >= 0) {
			myCanvas.measures.splice(idx, 1);
		}

		// Delete all nodes
		Object.values(this.points).forEach((point) => point.clean());
	}
}
