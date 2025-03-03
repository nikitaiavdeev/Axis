import { myCanvas } from "$lib/runes/canvas.svelte";
import { Point } from "../point/rune.svelte";

export class Measure {
	type = $state("free" as "horizontal" | "vertical" | "free");

	points = {
		point1: new Point(this, {
			xMover: (value) => {
				const dx = value - this.points.point1.x;
				this.points.point2.xResize(this.points.point2.x + dx);
				this.points.point3.xResize(this.points.point3.x + dx);
				return value;
			},
			yMover: (value) => {
				const dy = value - this.points.point1.y;
				this.points.point2.yResize(this.points.point2.y + dy);
				this.points.point3.yResize(this.points.point3.y + dy);
				return value;
			},
			// Standard resize and getter
		}),
		point2: new Point(this, {
			xMover: (value) => {
				const dx = value - this.points.point2.x;
				this.points.point1.xResize(this.points.point1.x + dx);
				this.points.point3.xResize(this.points.point3.x + dx);
				return value;
			},
			yMover: (value) => {
				const dy = value - this.points.point2.y;
				this.points.point1.yResize(this.points.point1.y + dy);
				this.points.point3.yResize(this.points.point3.y + dy);
				return value;
			},
			// Standard resize and getter
		}),
		point3: new Point(this, {
			xMover: (value) => {
				const dx = value - this.points.point3.x;
				this.points.point1.xResize(this.points.point1.x + dx);
				this.points.point2.xResize(this.points.point2.x + dx);
				return value;
			},
			yMover: (value) => {
				const dy = value - this.points.point3.y;
				this.points.point1.yResize(this.points.point1.y + dy);
				this.points.point2.yResize(this.points.point2.y + dy);
				return value;
			},
			// Standard resize and getter
		}),
	};

	dimention = $derived.by(() => {
		switch (this.type) {
			case "free":
				return Math.sqrt(
					(this.points.point1.x - this.points.point2.x) ** 2 +
						(this.points.point1.y - this.points.point2.y) ** 2
				);
			case "horizontal":
				return Math.abs(this.points.point1.x - this.points.point2.x);
			case "vertical":
				return Math.abs(this.points.point1.y - this.points.point2.y);
		}
	});

	constructor() {}

	remove() {
		// Delete measure
		const idx = myCanvas.measures.findIndex((m) => m === this);
		if (idx >= 0) {
			myCanvas.measures.splice(idx, 1);
		}

		// Delete all nodes
		Object.values(this.points).forEach((point) => point.remove());
	}
}
