import { myCanvas } from "$lib/runes/canvas.svelte";
import * as d3 from "d3";
import type { Polygon } from "../shapes/Polygon/rune.svelte";
import type { Rectangle } from "../shapes/Rectangle/rune.svelte";
import type { Circle } from "../shapes/Circle/rune.svelte";
import { Measure } from "../measure/rune.svelte";

export class Point {
	x = () => 0;
	y = () => 0;

	parent: Circle | Polygon | Rectangle | Measure | "CG";

	d3Coord = $derived({
		x: myCanvas.d3Scale.x(this.x()),
		y: myCanvas.d3Scale.y(this.y()),
	});

	constructor(
		x: () => number,
		y: () => number,
		parent: Circle | Polygon | Rectangle | Measure | "CG"
	) {
		this.x = x;
		this.y = y;
		this.parent = parent;

		if (!(parent instanceof Measure)) {
			points.addToList(this);
		} 
	}

	clean() {
		points.removeFromList(this);
	}
}

export const points = (() => {
	const __list = $state([] as Point[]);

	const __delaunay = $derived(
		new d3.Delaunay(
			new Float32Array(
				__list
					.filter(
						(point) =>
							point.parent !== myCanvas.newShape.shape && point.parent !== myCanvas.editShape.shape
					)
					.map((point) => [point.x(), point.y()])
					.flat()
			)
		)
	);

	return {
		addToList(point: Point) {
			__list[__list.length] = point;
		},
		removeFromList(point: Point) {
			const idx = __list.findIndex((p) => p === point);
			if (idx >= 0) {
				__list.splice(idx, 1);
			}
		},
		get list() {
			return __list;
		},
		get delaunay() {
			return __delaunay;
		},
	};
})();
