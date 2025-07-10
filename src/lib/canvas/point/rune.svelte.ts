import { myCanvas } from "$lib/runes/canvas.svelte";
import * as d3 from "d3";
import { Measure } from "../measure/rune.svelte";
import type { Shape } from "../shapes/index.svelte";

// Represents a point on the canvas, which may be part of a shape or measure
export class Point {
	x = $state(0); // X coordinate (reactive)
	y = $state(0); // Y coordinate (reactive)
	parent: Shape | Measure | "CG"; // Parent object (shape, measure, or center of gravity)
	affectedPoints = $state([] as Point[]); // Points affected by this point's movement

	// Resize scales for affected points (reactive)
	affectedPointsScales = $state({ x: [], y: [] } as { x: number[]; y: number[] });
	name = $state(""); // Name of the point (reactive)
	resizeCursor = $state(
		"ne-resize" as "ne-resize" | "nw-resize" | "e-resize" | "n-resize" | "move"
	); // Cursor style for resizing (reactive)

	// Movement and resizing functions (can be customized per point)
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

	// Derived properties for D3 coordinate mapping
	d3Coord = $derived({
		x: myCanvas.d3Scale.x(this.x),
		y: myCanvas.d3Scale.y(this.y),
	});

	/**
	 * Point constructor
	 * @param parent - Parent shape, measure, or "CG"
	 * @param config - Optional configuration for point properties and behaviors
	 */
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

		// Assign movement and resizing methods
		this.xMover = xMover;
		this.yMover = yMover;
		this.xResizer = xResizer;
		this.yResizer = yResizer;

		// Register point as an anchor if not part of a Measure
		if (!(this.parent instanceof Measure)) {
			anchorPoints.addToList(this);
		}
	}

	// Move point in X direction and update affected points
	xMove(value: number, affectedPoints = this.affectedPoints) {
		this.xMover(value, affectedPoints);
	}

	// Move point in Y direction and update affected points
	yMove(value: number, affectedPoints = this.affectedPoints) {
		this.yMover(value, affectedPoints);
	}

	// Resize point in X direction and update affected points with scaling
	xResize(
		value: number,
		affectedPoints = this.affectedPoints,
		affectedPointsScales = this.affectedPointsScales
	) {
		this.xResizer(value, affectedPoints, affectedPointsScales);
	}

	// Resize point in Y direction and update affected points with scaling
	yResize(
		value: number,
		affectedPoints = this.affectedPoints,
		affectedPointsScales = this.affectedPointsScales
	) {
		this.yResizer(value, affectedPoints, affectedPointsScales);
	}

	// Remove point from anchor list if not part of a Measure
	remove() {
		if (!(this.parent instanceof Measure)) {
			anchorPoints.removeFromList(this);
		}
	}
}

// Manages a list of anchor points for the canvas
export class AnchorPoints {
	list = $state<Point[]>([]); // List of anchor points (reactive)

	// Delaunay triangulation of anchor points (derived)
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

	// Compute min/max bounds for anchor points (derived)
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

	// Add a point to the anchor list
	addToList(point: Point) {
		this.list[this.list.length] = point;
	}

	// Remove a point from the anchor list
	removeFromList(point: Point) {
		this.list = this.list.filter((p) => p !== point);
	}
}

// Singleton instance for managing anchor points
export const anchorPoints = new AnchorPoints();
