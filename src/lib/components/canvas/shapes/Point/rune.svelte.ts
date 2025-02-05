import { myCanvas } from "$lib/runes/canvas.svelte";
import * as d3 from "d3";

export class Point {
	x = () => 0;
	y = () => 0;
	id = $state(0);
	isMagnet = $state(false);
	d3Coord = $derived({
		x: myCanvas.d3Scale.x(this.x()),
		y: myCanvas.d3Scale.y(this.y()),
	});

	constructor(x: () => number, y: () => number) {
		this.x = x;
		this.y = y;

		this.id = points.addToList(this);
	}

	delete() {}
}

export const points = (() => {
	let __list = $state([] as Point[]);

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
		addToList(point: Point): number {
			const idx = __list.length;
			__list[idx] = point;
			return idx;
		},
		removeFromList(idx: number) {
			__list.splice(idx, 1);
		},
		get list() {
			return __list;
		},
		get delaunay() {
			return __delaunay;
		},
	};
})();
