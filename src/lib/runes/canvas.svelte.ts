import { points } from "$lib/components/canvas/shapes/Point/rune.svelte";
import { Rectangle } from "$lib/components/canvas/shapes/Rectangle/rune.svelte";
import * as d3 from "d3";
import { ui } from "./ui.svelte";

const NewShape = () => {
		let __shape = $state(undefined as undefined | Rectangle);

		return {
			get shape() {
				return __shape;
			},
			createNew(shape: Rectangle) {
				myCanvas.editShape.clean();
				__shape = shape;
			},
			clean() {
				if (__shape) {
					__shape.clean();
					__shape = undefined;
				}
			},
		};
	},
	EditShape = () => {
		let __shape = $state(undefined as undefined | Rectangle);

		return {
			get shape() {
				return __shape;
			},
			toggleMode() {
				if (ui.options.editMode === "move") {
					ui.options.editMode = "resize";
				} else {
					ui.options.editMode = "move";
				}
			},
			editShape(shape: Rectangle) {
				__shape = shape;
			},
			clean() {
				if (__shape) {
					__shape = undefined;
				}
			},
		};
	};

export class Canvas {
	offsetX = $state(0);
	offsetY = $state(0);
	scale = $state(1);

	consts = {
		GRID_SIZE: 500,
	};

	newShape = NewShape();
	editShape = EditShape();

	shapes = $state([] as Rectangle[]);

	private __svg: undefined | d3.Selection<Element, unknown, HTMLElement, HTMLElement>;
	private __gridPattern: undefined | d3.Selection<Element, unknown, HTMLElement, HTMLElement>;
	private __content: undefined | d3.Selection<Element, unknown, HTMLElement, HTMLElement>;

	mouseScale = $derived({
		x: d3.scaleLinear([0, 0.5], [this.offsetX, this.offsetX + this.consts.GRID_SIZE * this.scale]),
		y: d3.scaleLinear([0, 0.5], [this.offsetY + this.consts.GRID_SIZE * this.scale, this.offsetY]),
	});

	d3Scale = {
		x: d3.scaleLinear([0, 0.5], [0, this.consts.GRID_SIZE * this.scale]),
		y: d3.scaleLinear([0, 0.5], [0 + this.consts.GRID_SIZE * this.scale, 0]),
	};

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

	fitView() {
		if (points.list.length < 1) return;

		// Find points max/min coordinates
		const minMaxValues = points.list.reduce(
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

	get svgSize(): DOMRect {
		return this.svg.node()!.getBoundingClientRect();
	}

	get svg(): d3.Selection<Element, unknown, HTMLElement, HTMLElement> {
		if (!this.__svg) {
			this.__svg = d3.select("#main-canvas");
		}

		return this.__svg;
	}

	get gridPattern(): d3.Selection<Element, unknown, HTMLElement, HTMLElement> {
		if (!this.__gridPattern) {
			this.__gridPattern = d3.select("#grid-pattern");
		}

		return this.__gridPattern;
	}

	get content(): d3.Selection<Element, unknown, HTMLElement, HTMLElement> {
		if (!this.__content) {
			this.__content = d3.select("#canvas-content");
		}

		return this.__content;
	}
}

export const myCanvas = new Canvas();
