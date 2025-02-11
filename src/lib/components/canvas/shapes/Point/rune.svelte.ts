import { myCanvas } from "$lib/runes/canvas.svelte";
import * as d3 from "d3";

export class Point {
	x = () => 0;
	y = () => 0;
	isMagnet = $state(false);
	d3Coord = $derived({
		x: myCanvas.d3Scale.x(this.x()),
		y: myCanvas.d3Scale.y(this.y()),
	});

	constructor(x: () => number, y: () => number, isMagnet = false) {
		this.x = x;
		this.y = y;
		this.isMagnet = isMagnet;

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
					.filter((point) => point.isMagnet)
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
