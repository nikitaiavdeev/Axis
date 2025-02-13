import { myCanvas } from "$lib/runes/canvas.svelte";
import * as d3 from "d3";
import type { Polygon } from "../Polygon/rune.svelte";
import type { Rectangle } from "../Rectangle/rune.svelte";
import type { Circle } from "../Circle/rune.svelte";

export class Point {
	x = () => 0;
	y = () => 0;

	parent: Circle | Polygon | Rectangle;

	d3Coord = $derived({
		x: myCanvas.d3Scale.x(this.x()),
		y: myCanvas.d3Scale.y(this.y()),
	});

	constructor(x: () => number, y: () => number, parent: Circle | Polygon | Rectangle) {
		this.x = x;
		this.y = y;
		this.parent = parent;

		points.addToList(this);
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
