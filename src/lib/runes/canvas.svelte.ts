import { anchorPoints, Point } from "$lib/canvas/point/rune.svelte";
import * as d3 from "d3";

// Shapes
import type { Measure } from "$lib/canvas/measure/rune.svelte";
import type { Shape } from "$lib/canvas/shapes/index.svelte";

// Constants
import { GRID_SIZE_PIXELS, GRID_SIZE_INCHES } from "$lib/constants.js";

/**
 * Canvas class manages the drawing area, shapes, zoom, pan, and UI state.
 */
export class Canvas {
	// Private properties for svg elements
	// Done this way because document isn't availabe during class construction
	#svg: undefined | d3.Selection<Element, unknown, HTMLElement, HTMLElement>;
	#gridPattern: undefined | d3.Selection<Element, unknown, HTMLElement, HTMLElement>;
	#content: undefined | d3.Selection<Element, unknown, HTMLElement, HTMLElement>;

	// Svg node binder for Svelte state management
	svgNodeBinder = $state(undefined as undefined | SVGGraphicsElement);

	// Canvas size (width, height)
	size = $state({
		width: 0,
		height: 0,
	});

	// Canvas content position and scale
	offsetX = $state(0); // Pan X offset
	offsetY = $state(0); // Pan Y offset
	scale = $state(1); // Zoom scale

	// Active element of the canvas (for creation or editing)
	newShape = $state(undefined as undefined | Shape | Measure);
	editShape = $state(undefined as undefined | Shape | Measure | Point);
	activeShape = $derived(this.newShape || this.editShape);

	// Lists of shapes and measurements on the canvas
	shapes = $state([] as Shape[]);
	measures = $state([] as Measure[]);

	// UI options for grid, magnet, edit mode, and results display
	uiOptions = $state({
		showGrid: true,
		magnet: true,
		editMode: "move" as "move" | "resize",
		showResults: false,
	});

	// Mouse state for interaction
	mouse = $state({
		x: 0,
		y: 0,
		magnetX: undefined as undefined | number,
		magnetY: undefined as undefined | number,
		down: false,
	});

	// D3 scale objects for coordinate transformations (without offset)
	d3Scale = {
		x: d3.scaleLinear([0, GRID_SIZE_INCHES], [0, GRID_SIZE_PIXELS * this.scale]),
		y: d3.scaleLinear([0, GRID_SIZE_INCHES], [0 + GRID_SIZE_PIXELS * this.scale, 0]),
	};

	// Derived D3 scales that account for canvas offset and zoom
	mouseScale = $derived({
		x: d3.scaleLinear(
			[0, GRID_SIZE_INCHES],
			[this.offsetX, this.offsetX + GRID_SIZE_PIXELS * this.scale]
		),
		y: d3.scaleLinear(
			[0, GRID_SIZE_INCHES],
			[this.offsetY + GRID_SIZE_PIXELS * this.scale, this.offsetY]
		),
	});

	// Grid size adjusted for current zoom
	scaledGridSize = $derived(GRID_SIZE_PIXELS * this.scale);

	// Derived properties for all shapes (area, centroid, moments of inertia)
	properties = $derived.by(() => {
		const properties = {
			area: 0,
			cX: 0,
			cY: 0,
			iX: 0,
			iY: 0,
			iXY: 0,
		};

		// Sum up properties from all shapes
		for (const shape of this.shapes) {
			properties.area += shape.properties.area;
			properties.cX += shape.properties.cX * shape.properties.area;
			properties.cY += shape.properties.cY * shape.properties.area;
		}

		// Calculate centroid if area is nonzero
		if (properties.area !== 0) {
			properties.cX /= properties.area;
			properties.cY /= properties.area;
		}

		// Calculate moments of inertia about centroid
		for (const shape of this.shapes) {
			const dX = properties.cX - shape.properties.cX,
				dY = properties.cY - shape.properties.cY;

			properties.iX += shape.properties.iX + shape.properties.area * dY ** 2;
			properties.iY += shape.properties.iY + shape.properties.area * dX ** 2;
			properties.iXY += shape.properties.iXY + shape.properties.area * dX * dY;
		}

		return properties;
	});

	// Point representing the center of gravity (CG)
	cgPoint = new Point("CG", {
		x: this.properties.cX,
		y: this.properties.cY,
	});

	/**
	 * Zoom in by a fixed factor.
	 */
	zoomIn() {
		this.zoomDelta(1.1);
	}

	/**
	 * Zoom out by a fixed factor.
	 */
	zoomOut() {
		this.zoomDelta(0.9);
	}

	/**
	 * Reset zoom to default (scale = 1).
	 */
	resetZoom() {
		this.zoomDelta(1 / this.scale);
	}

	/**
	 * Change zoom by a given factor, centered at (posX, posY).
	 * @param zoomScale Zoom multiplier
	 * @param posX X coordinate to zoom around (default: center)
	 * @param posY Y coordinate to zoom around (default: center)
	 */
	zoomDelta(zoomScale: number, posX = this.size.width * 0.5, posY = this.size.height * 0.5) {
		// Clamp zoom scale between 0.1 and 10
		if (this.scale * zoomScale < 0.1) zoomScale = 0.1 / this.scale;
		if (this.scale * zoomScale > 10) zoomScale = 10 / this.scale;

		// Adjust offsets to zoom around the given point
		this.offsetX -= (posX - this.offsetX) * (zoomScale - 1);
		this.offsetY -= (posY - this.offsetY) * (zoomScale - 1);
		this.scale *= zoomScale;
	}

	/**
	 * Pan the canvas in the given direction.
	 * @param direction Arrow key direction
	 */
	move(direction: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown") {
		switch (direction) {
			case "ArrowLeft":
				this.offsetX += 0.5 * this.scale * GRID_SIZE_PIXELS;
				break;
			case "ArrowRight":
				this.offsetX -= 0.5 * this.scale * GRID_SIZE_PIXELS;
				break;
			case "ArrowUp":
				this.offsetY += 0.5 * this.scale * GRID_SIZE_PIXELS;
				break;
			case "ArrowDown":
				this.offsetY -= 0.5 * this.scale * GRID_SIZE_PIXELS;
				break;
		}
	}

	/**
	 * Fit all anchor points into the view, centering and zooming appropriately.
	 */
	fitView() {
		if (anchorPoints.list.length < 1) return;

		// Find points max/min coordinates
		const minMaxValues = anchorPoints.list.reduce(
				(acc, point) => ({
					minX: Math.min(acc.minX, point.d3Coord.x),
					maxX: Math.max(acc.maxX, point.d3Coord.x),
					minY: Math.min(acc.minY, point.d3Coord.y),
					maxY: Math.max(acc.maxY, point.d3Coord.y),
				}),
				{ minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
			),
			center = {
				x: 0.5 * (minMaxValues.maxX + minMaxValues.minX),
				y: 0.5 * (minMaxValues.maxY + minMaxValues.minY),
			},
			size = {
				width: minMaxValues.maxX - minMaxValues.minX,
				height: minMaxValues.maxY - minMaxValues.minY,
			},
			svgSize = this.size;

		// Move to center
		this.offsetX = 0.5 * svgSize.width - center.x * this.scale;
		this.offsetY = 0.5 * svgSize.height - center.y * this.scale;

		// Adjust zoom to fit all points
		const svgElement = this.svg.node();
		if (svgElement) {
			const svgSize = this.size,
				fitZoom = Math.min(svgSize.width / size.width, svgSize.height / size.height) * 0.9;

			this.zoomDelta(fitZoom / this.scale);
		}
	}

	/**
	 * Get the SVG node element.
	 */
	get svgNode(): SVGGraphicsElement {
		return this.svgNodeBinder!;
	}

	/**
	 * Get the D3 selection for the main SVG element.
	 */
	get svg(): d3.Selection<Element, unknown, HTMLElement, HTMLElement> {
		if (!this.#svg) {
			this.#svg = d3.select("#main-canvas");
		}

		return this.#svg;
	}

	/**
	 * Get the D3 selection for the grid pattern element.
	 */
	get gridPattern(): d3.Selection<Element, unknown, HTMLElement, HTMLElement> {
		if (!this.#gridPattern) {
			this.#gridPattern = d3.select("#grid-pattern");
		}

		return this.#gridPattern;
	}

	/**
	 * Get the D3 selection for the canvas content group.
	 */
	get content(): d3.Selection<Element, unknown, HTMLElement, HTMLElement> {
		if (!this.#content) {
			this.#content = d3.select("#canvas-content");
		}

		return this.#content;
	}
}

// Singleton instance of the Canvas for use throughout the app
export const myCanvas = new Canvas();
