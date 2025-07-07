import { myCanvas } from "$lib/runes/canvas.svelte";
import * as d3 from "d3";
import { Measure } from "../measure/rune.svelte";
import type { Shape } from "../shapes/index.svelte";

export class Point {
	x = $state(0);
	y = $state(0);
	parent: Shape | Measure | "CG";
	affectedPoints = $state([] as Point[]);

	// Resize scales for affected points
	affectedPointsScales = $state({ x: [], y: [] } as { x: number[]; y: number[] });
	name = $state("");
	resizeCursor = $state(
		"ne-resize" as "ne-resize" | "nw-resize" | "e-resize" | "n-resize" | "move"
	);

	// Movement and resizing functions
	xMover: (value: number, affectedPoints: Point[]) => void;
	yMover: (value: number, affectedPoints: Point[]) => void;
	xResizer: (
		value: number,
		affectedPoints: Point[],
		affectedPointsScales: { x: number[]; y: number[] }
	) => void;
	yResizer: (
		value: number,
		affectedPoints: Point[],
		affectedPointsScales: { x: number[]; y: number[] }
	) => void;

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
			name = "",
			affectedPoints = [] as Point[],
			affectedPointsScales = { x: [], y: [] } as { x: number[]; y: number[] },
			resizeCursor = "ne-resize" as typeof this.resizeCursor,
			xMover = (value: number, affectedPoints = this.affectedPoints) => {
				const delta = value - this.x;

				for (const point of affectedPoints) {
					point.x += delta;
				}
			},
			yMover = (value: number, affectedPoints = this.affectedPoints) => {
				const delta = value - this.y;

				for (const point of affectedPoints) {
					point.y += delta;
				}
			},
			xResizer = (
				value: number,
				affectedPoints = this.affectedPoints,
				affectedPointsScales = this.affectedPointsScales
			) => {
				const delta = value - this.x;

				affectedPoints.forEach((affectedPoint, idx) => {
					affectedPoint.x += delta * affectedPointsScales.x[idx];
				});
			},
			yResizer = (
				value: number,
				affectedPoints = this.affectedPoints,
				affectedPointsScales = this.affectedPointsScales
			) => {
				const delta = value - this.y;

				affectedPoints.forEach((affectedPoint, idx) => {
					affectedPoint.y += delta * affectedPointsScales.y[idx];
				});
			},
		}
	) {
		this.x = x;
		this.y = y;
		this.parent = parent;
		this.name = name;
		this.affectedPoints = affectedPoints;
		this.affectedPointsScales = affectedPointsScales;
		this.resizeCursor = resizeCursor;

		// Assign methods
		this.xMover = xMover;
		this.yMover = yMover;
		this.xResizer = xResizer;
		this.yResizer = yResizer;

		if (!(this.parent instanceof Measure)) {
			anchorPoints.addToList(this);
		}
	}

	xMove(value: number, affectedPoints = this.affectedPoints) {
		this.xMover(value, affectedPoints);
	}

	yMove(value: number, affectedPoints = this.affectedPoints) {
		this.yMover(value, affectedPoints);
	}

	xResize(
		value: number,
		affectedPoints = this.affectedPoints,
		affectedPointsScales = this.affectedPointsScales
	) {
		this.xResizer(value, affectedPoints, affectedPointsScales);
	}

	yResize(
		value: number,
		affectedPoints = this.affectedPoints,
		affectedPointsScales = this.affectedPointsScales
	) {
		this.yResizer(value, affectedPoints, affectedPointsScales);
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
					.filter(
						(point) => point.parent !== myCanvas.activeShape && point === myCanvas.activeShape
					)
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
