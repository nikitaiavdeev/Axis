import { myCanvas } from "$lib/runes/canvas.svelte";
import type { Point } from "../point/rune.svelte";

export abstract class Shape {
	isHole = $state(false);
	abstract readonly points: Readonly<Record<string, Point>>;
	abstract properties: {
		area: number;
		cX: number;
		cY: number;
		iX: number;
		iY: number;
		iXY: number;
	};

	constructor(isHole = false) {
		this.isHole = isHole;
	}

	remove() {
		// Delete shape
		myCanvas.shapes = myCanvas.shapes.filter((s) => s !== this);

		// Delete all nodes
		Object.values(this.points).forEach((point) => point.remove());
	}
}
