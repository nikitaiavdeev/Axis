import { myCanvas } from "$lib/runes/canvas.svelte";
import type { Point } from "../point/rune.svelte";


export abstract class Shape {
    isHole = $state(false);
    abstract points: Record<string, Point>;
    abstract properties: {
        area: number,
        cX: number,
        cY: number,
        iX: number,
        iY: number,
        iXY: number,
    };

	constructor(isHole = false) {
        this.isHole = isHole;
    }

	remove() {
		// Delete shape
		const idx = myCanvas.shapes.findIndex((s) => s === this);

		if (idx >= 0) {
			myCanvas.shapes.splice(idx, 1);
		}

		// Delete all nodes
		Object.values(this.points).forEach((point) => point.remove());
	}
}
