import * as d3 from "d3";
import { ui } from "./ui.svelte";

export class Canvas {
	private __svg: undefined | d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
	private __gridPattern: undefined | d3.Selection<SVGPatternElement, unknown, HTMLElement, any>;
	private __content: undefined | d3.Selection<SVGGElement, unknown, HTMLElement, any>;

	consts = {
		GRID_SIZE: 25,
	};

	svgInit() {
		// Zoom and manipulations
		this.svg.call(
			d3
				.zoom()
				.scaleExtent([0.1, 5])
				.on("zoom", ({ transform }) => {
					const position = ui.options.position;
					position.x = transform.x;
					position.y = transform.y;
					position.zoom = transform.k;
				})
				.filter((event) => {
					return (event.button === 0 && event.type === "wheel") || event.button === 1;
				}) as any
		);

		// Get mouse position
		this.svg.on("mousemove", (event) => {
			const pointer = d3.pointer(event);

			ui.mouse.x = this.d3Scale.x.invert(pointer[0]);
			ui.mouse.y = this.d3Scale.y.invert(pointer[1]);
		});
	}

	get svg(): d3.Selection<SVGSVGElement, unknown, HTMLElement, any> {
		if (!this.__svg) {
			this.__svg = d3.select("#main-canvas");
		}

		return this.__svg;
	}

	get gridPattern(): d3.Selection<SVGPatternElement, unknown, HTMLElement, any> {
		if (!this.__gridPattern) {
			this.__gridPattern = d3.select("#grid-pattern");
		}

		return this.__gridPattern;
	}

	get content(): d3.Selection<SVGGElement, unknown, HTMLElement, any> {
		if (!this.__content) {
			this.__content = d3.select("#canvas-content");
		}

		return this.__content;
	}

	get d3Scale(){
		return {
			x: d3.scaleLinear( [ui.options.position.x, ui.options.position.x + 25*ui.options.position.zoom] ),
			y: d3.scaleLinear( [ui.options.position.y + 25*ui.options.position.zoom, ui.options.position.y ] )
		}
	}

}

export const myCanvas = new Canvas();
