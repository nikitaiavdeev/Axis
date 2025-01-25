import type { Rectangle } from "$lib/components/canvas/shapes/Rectangle/rectangleRune.svelte";
import * as d3 from "d3";

export class Canvas {
	offsetX = $state(0);
	offsetY = $state(0);
	scale = $state(1);

	consts = {
		GRID_SIZE: 500,
	};

	newShape = $state(undefined as undefined | Rectangle);

	shapes = $state([] as Rectangle[]);

	private __svg: undefined | d3.Selection<Element, unknown, HTMLElement, HTMLElement>;
	private __gridPattern: undefined | d3.Selection<Element, unknown, HTMLElement, HTMLElement>;
	private __content: undefined | d3.Selection<Element, unknown, HTMLElement, HTMLElement>;

	d3Scale = $derived({
		x: d3.scaleLinear([0, 0.5], [this.offsetX, this.offsetX + this.consts.GRID_SIZE * this.scale]),
		y: d3.scaleLinear([0, 0.5], [this.offsetY + this.consts.GRID_SIZE * this.scale, this.offsetY]),
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

	zoomDelta(
		zoomScale: number,
		posX = this.svg.node()!.getBoundingClientRect().width * 0.5,
		posY = this.svg.node()!.getBoundingClientRect().height * 0.5
	) {
		this.offsetX -= (posX - this.offsetX) * (zoomScale - 1);
		this.offsetY -= (posY - this.offsetY) * (zoomScale - 1);
		this.scale *= zoomScale;
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
