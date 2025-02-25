import { anchorPoints, Point } from "$lib/canvas/point/rune.svelte";
import * as d3 from "d3";

// Shapes
import type { Measure } from "$lib/canvas/measure/rune.svelte";
import type { Shape } from "$lib/canvas/shapes/index.svelte";

export class Canvas {
	// Private properties for svg elements
	// Done this way because document isn't availabe during class construction
	#svg: undefined | d3.Selection<Element, unknown, HTMLElement, HTMLElement>;
	#gridPattern: undefined | d3.Selection<Element, unknown, HTMLElement, HTMLElement>;
	#content: undefined | d3.Selection<Element, unknown, HTMLElement, HTMLElement>;

	// Canvas constants
	consts = {
		GRID_SIZE: 500,
	};

	// Canvas content position and scale
	offsetX = $state(0);
	offsetY = $state(0);
	scale = $state(1);

	// Active element of the canvas
	activeElement = $state(undefined as undefined | Shape | Measure);
	activeElementMode = $state(undefined as undefined | "new" | "move" | "resize");

	// Shapes and measurments
	shapes = $state([] as Shape[]);
	measures = $state([] as Measure[]);

	// UI options
	uiOptions = $state({
		showGrid: true,
		magnet: true,
		editMode: "move" as "move" | "resize",
		showResults: false,
	});

	// Mouse state
	mouse = $state({
		x: 0,
		y: 0,
		down: false,
	});

	// Scale without account for canvas offset
	d3Scale = {
		x: d3.scaleLinear([0, 0.5], [0, this.consts.GRID_SIZE * this.scale]),
		y: d3.scaleLinear([0, 0.5], [0 + this.consts.GRID_SIZE * this.scale, 0]),
	};

	// Derived properties
	// Scale with account for canvas offset
	mouseScale = $derived({
		x: d3.scaleLinear([0, 0.5], [this.offsetX, this.offsetX + this.consts.GRID_SIZE * this.scale]),
		y: d3.scaleLinear([0, 0.5], [this.offsetY + this.consts.GRID_SIZE * this.scale, this.offsetY]),
	});

	svgSize = $derived(this.svg.node()!.getBoundingClientRect());

	properties = $derived.by(() => {
		const properties = {
			area: 0,
			cX: 0,
			cY: 0,
			iX: 0,
			iY: 0,
			iXY: 0,
		};

		for (const shape of this.shapes) {
			properties.area += shape.properties.area;
			properties.cX += shape.properties.cX * shape.properties.area;
			properties.cY += shape.properties.cY * shape.properties.area;
		}

		if (properties.area !== 0) {
			properties.cX /= properties.area;
			properties.cY /= properties.area;
		}

		for (const shape of this.shapes) {
			const dX = properties.cX - shape.properties.cX,
				dY = properties.cY - shape.properties.cY;

			properties.iX += shape.properties.iX + shape.properties.area * dY ** 2;
			properties.iY += shape.properties.iY + shape.properties.area * dX ** 2;
			properties.iXY += shape.properties.iXY + shape.properties.area * dX * dY;
		}

		return properties;
	});

	cgPoint = new Point("CG", {
		x: this.properties.cX,
		y: this.properties.cY,
	});

	zoomIn() {
		this.zoomDelta(1.1);
	}

	zoomOut() {
		this.zoomDelta(0.9);
	}

	resetZoom() {
		this.zoomDelta(1 / this.scale);
	}

	zoomDelta(zoomScale: number, posX = this.svgSize.width * 0.5, posY = this.svgSize.height * 0.5) {
		if (this.scale * zoomScale < 0.1) zoomScale = 0.1 / this.scale;

		if (this.scale * zoomScale > 3) zoomScale = 3 / this.scale;

		this.offsetX -= (posX - this.offsetX) * (zoomScale - 1);
		this.offsetY -= (posY - this.offsetY) * (zoomScale - 1);
		this.scale *= zoomScale;
	}

	move(direction: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown") {
		switch (direction) {
			case "ArrowLeft":
				this.offsetX += 0.5 * this.scale * this.consts.GRID_SIZE;
				break;
			case "ArrowRight":
				this.offsetX -= 0.5 * this.scale * this.consts.GRID_SIZE;
				break;
			case "ArrowUp":
				this.offsetY += 0.5 * this.scale * this.consts.GRID_SIZE;
				break;
			case "ArrowDown":
				this.offsetY -= 0.5 * this.scale * this.consts.GRID_SIZE;
				break;
		}
	}

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
			svgSize = this.svgSize;

		// Move to center
		this.offsetX = 0.5 * svgSize.width - center.x * this.scale;
		this.offsetY = 0.5 * svgSize.height - center.y * this.scale;

		// Adjust zoom
		const svgElement = this.svg.node();
		if (svgElement) {
			const svgSize = this.svgSize,
				fitZoom = Math.min(svgSize.width / size.width, svgSize.height / size.height) * 0.9;

			this.zoomDelta(fitZoom / this.scale);
		}
	}

	get svg(): d3.Selection<Element, unknown, HTMLElement, HTMLElement> {
		if (!this.#svg) {
			this.#svg = d3.select("#main-canvas");
		}

		return this.#svg;
	}

	get gridPattern(): d3.Selection<Element, unknown, HTMLElement, HTMLElement> {
		if (!this.#gridPattern) {
			this.#gridPattern = d3.select("#grid-pattern");
		}

		return this.#gridPattern;
	}

	get content(): d3.Selection<Element, unknown, HTMLElement, HTMLElement> {
		if (!this.#content) {
			this.#content = d3.select("#canvas-content");
		}

		return this.#content;
	}
}

export const myCanvas = new Canvas();
