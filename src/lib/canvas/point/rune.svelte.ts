import { myCanvas } from "$lib/runes/canvas.svelte";
import * as d3 from "d3";
import { Measure } from "../measure/rune.svelte";
import type { Shape } from "../shapes/index.svelte";

export class Point {
	#x = $state(0);
	#y = $state(0);
	parent: Shape | Measure | "CG";

	// Setter functions
	xSetter: (value: number) => void;
	ySetter: (value: number) => void;

	// Derived properties
	d3Coord = $derived({
		x: myCanvas.d3Scale.x(this.x),
		y: myCanvas.d3Scale.y(this.y),
	});

	constructor(
		x: number,
		y: number,
		parent: Shape | Measure | "CG",
		xSetter = (value: number) => {
			this.#x = value;
		},
		ySetter = (value: number) => {
			this.#x = value;
		}
	) {
		this.#x = x;
		this.#y = y;

		this.parent = parent;

		// Use custom setters if provided
		this.xSetter = xSetter;
		this.ySetter = ySetter;

		if (!(this.parent instanceof Measure)) {
			anchorPoints.addToList(this);
		}
	}


	get x() {
		return this.#x;
	}

	set x(value) {
		this.xSetter(value);
	}

	get y() {
		return this.#y;
	}

	set y(value) {
		this.ySetter(value);
	}

	remove() {
		if (!(this.parent instanceof Measure)) {
			anchorPoints.removeFromList(this);
		}
	}
}

export class AnchorPoints {
	list = $state([] as Point[]);

	// Derived properties
	delaunay = $derived(
		new d3.Delaunay(
			new Float32Array(
				this.list
					.filter(
						(point) =>
							point.parent !== myCanvas.newShape.shape && point.parent !== myCanvas.editShape.shape
					)
					.map((point) => [point.x, point.y])
					.flat()
			)
		)
	);

	maxMin = $derived(
		this.list.reduce(
			(acc, p) => {
				if (p.d3Coord.x < acc.minX) acc.minX = p.d3Coord.x;
				if (p.d3Coord.x > acc.maxX) acc.maxX = p.d3Coord.x;

				if (p.d3Coord.y < acc.minY) acc.minY = p.d3Coord.y;
				if (p.d3Coord.y > acc.maxY) acc.maxY = p.d3Coord.y;

				return acc;
			},
			{
				minX: Infinity,
				maxX: -Infinity,

				minY: Infinity,
				maxY: -Infinity,
			}
		)
	);

	addToList(point: Point) {
		this.list[this.list.length] = point;
	}

	removeFromList(point: Point) {
		const idx = this.list.findIndex((p) => p === point);
		if (idx >= 0) {
			this.list.splice(idx, 1);
		}
	}
}

export const anchorPoints = new AnchorPoints();
