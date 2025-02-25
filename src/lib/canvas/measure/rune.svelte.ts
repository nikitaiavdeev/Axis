import { myCanvas } from "$lib/runes/canvas.svelte";
import { Point } from "../point/rune.svelte";

export class Measure {
	type = $state("free" as "horizontal" | "vertical" | "free");
	point1 = $state({
		x: NaN,
		y: NaN,
	});
	point2 = $state({
		x: NaN,
		y: NaN,
	});
	point3 = $state({
		x: NaN,
		y: NaN,
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

	dimention = $derived.by(() => {
		switch (this.type) {
			case "free":
				return Math.sqrt(
					(this.point1.x - this.point2.x) ** 2 + (this.point1.y - this.point2.y) ** 2
				).toFixed(3);
			case "horizontal":
				return Math.abs(this.point1.x - this.point2.x).toFixed(3);
			case "vertical":
				return Math.abs(this.point1.y - this.point2.y).toFixed(3);
		}
	});

	constructor() {}

	remove() {
		// Delete shape
		const idx = myCanvas.measures.findIndex((m) => m === this);
		if (idx >= 0) {
			myCanvas.measures.splice(idx, 1);
		}

		// Delete all nodes
		Object.values(this.points).forEach((point) => point.clean());
	}
}
