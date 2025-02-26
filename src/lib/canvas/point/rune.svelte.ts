import { myCanvas } from "$lib/runes/canvas.svelte";
import * as d3 from "d3";
import { Measure } from "../measure/rune.svelte";
import type { Shape } from "../shapes/index.svelte";

export class Point {
	#x = $state(0);
	#y = $state(0);
	parent: Shape | Measure | "CG";

	// Movement and resizing functions
	xGetter: () => number;
	yGetter: () => number;
	xMover: (value: number) => number;
	yMover: (value: number) => number;
	xResizer: (value: number) => number;
	yResizer: (value: number) => number;

	// Derived properties
	d3Coord = $derived({
		x: myCanvas.d3Scale.x(this.x),
		y: myCanvas.d3Scale.y(this.y),
	});

	constructor(
		parent: Shape | Measure | "CG",
		{
			x = NaN,
			y = NaN,
			xGetter = () => {
				return this.#x;
			},
			yGetter = () => {
				return this.#y;
			},
			xMover = (value: number) => {
				return value;
			},
			yMover = (value: number) => {
				return value;
			},
			xResizer = (value: number) => {
				return value;
			},
			yResizer = (value: number) => {
				return value;
			},
		}
	) {
		this.#x = x;
		this.#y = y;
		this.parent = parent;

		// Assign methods
		this.xGetter = xGetter;
		this.yGetter = yGetter;
		this.xMover = xMover;
		this.yMover = yMover;
		this.xResizer = xResizer;
		this.yResizer = yResizer;

		if (!(this.parent instanceof Measure)) {
			anchorPoints.addToList(this);
		}
	}

	get x() {
		return this.xGetter();
	}

	xMove(value: number) {
		this.#x = this.xMover(value);
	}

	xResize(value: number) {
		this.#x = this.xResizer(value);
	}

	get y() {
		return this.yGetter();
	}

	yMove(value: number) {
		this.#y = this.yMover(value);
	}

	yResize(value: number) {
		this.#y = this.yResizer(value);
	}

	remove() {
		if (!(this.parent instanceof Measure)) {
			anchorPoints.removeFromList(this);
		}
	}
}

export class AnchorPoints {
	list = $state<Point[]>([]);

	// Derived properties
	delaunay = $derived(
		new d3.Delaunay(
			new Float32Array(
				this.list
					.filter((point) => point.parent !== myCanvas.activeElement)
					.flatMap((point) => [point.x, point.y])
			)
		)
	);

	maxMin = $derived.by(() => {
		if (this.list.length === 0) {
			return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
		}

		return this.list.reduce(
			(acc, p) => ({
				minX: Math.min(acc.minX, p.d3Coord.x),
				maxX: Math.max(acc.maxX, p.d3Coord.x),
				minY: Math.min(acc.minY, p.d3Coord.y),
				maxY: Math.max(acc.maxY, p.d3Coord.y),
			}),
			{
				minX: Infinity,
				maxX: -Infinity,
				minY: Infinity,
				maxY: -Infinity,
			}
		);
	});

	addToList(point: Point) {
		this.list[this.list.length] = point;
	}

	removeFromList(point: Point) {
		this.list = this.list.filter((p) => p !== point);
	}
}

export const anchorPoints = new AnchorPoints();
