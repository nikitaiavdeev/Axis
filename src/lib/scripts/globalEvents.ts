// Math
import { vec2 } from "gl-matrix";

// Runes
import { points } from "$lib/canvas/shapes/Point/rune.svelte";
import { myCanvas } from "$lib/runes/canvas.svelte";
import { ui } from "$lib/runes/ui.svelte";
import { roundFloat } from "./helpers.svelte";

export const keyPressEvent = (event: KeyboardEvent) => {
		// Canvas zoom
		if (event.ctrlKey && ["+", "-"].includes(event.key)) {
			event.preventDefault();
			if (event.key == "+") myCanvas.zoomIn();
			if (event.key == "-") myCanvas.zoomOut();
			return;
		}

		// Canvas fit view
		if (event.ctrlKey && event.key == "f") {
			event.preventDefault();
			myCanvas.fitView();
			return;
		}

		// Canvas move
		if (event.ctrlKey && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
			event.preventDefault();
			myCanvas.move(event.key as "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown");
			return;
		}
	},
	onWheel = (event: WheelEvent) => {
		// if (event.ctrlKey) {
		const zoomScale = 1 - event.deltaY * 0.001;
		myCanvas.zoomDelta(zoomScale, event.pageX, event.pageY);
		// }
	},
	onMouseMove = (event: MouseEvent) => {
		event.preventDefault();

		// Prevent selection while edeting elemetns
		if (ui.mouse.down) {
			window.getSelection()?.removeAllRanges();
		}

		if (event.buttons == 4) {
			document.body.style.cursor = "grabbing";
			myCanvas.offsetX += event.movementX;
			myCanvas.offsetY += event.movementY;
			return;
		}

		document.body.style.cursor = "auto";

		ui.mouse.x = roundFloat(myCanvas.mouseScale.x.invert(event.pageX), 3);
		ui.mouse.y = roundFloat(myCanvas.mouseScale.y.invert(event.pageY), 3);

		// Magnet mouse location
		if (ui.options.magnet) {
			// Magnet to points
			const closestPointID = points.delaunay.find(ui.mouse.x, ui.mouse.y),
				distanceToPixelsScale = 2 * myCanvas.consts.GRID_SIZE * myCanvas.scale;

			if (closestPointID) {
				const closestPointXY = vec2.fromValues(
						points.list[closestPointID].x(),
						points.list[closestPointID].y()
					),
					distance = vec2.dist(vec2.fromValues(ui.mouse.x, ui.mouse.y), closestPointXY);

				if (distance * distanceToPixelsScale < 20) {
					ui.mouse.x = closestPointXY[0];
					ui.mouse.y = closestPointXY[1];
					return;
				}
			}

			// Magnet to grid
			const closestX = Math.round(ui.mouse.x / 0.1) * 0.1,
				closestY = Math.round(ui.mouse.y / 0.1) * 0.1;

			if (Math.abs(ui.mouse.x - closestX) * distanceToPixelsScale < 20) {
				ui.mouse.x = closestX;
			}
			if (Math.abs(ui.mouse.y - closestY) * distanceToPixelsScale < 20) {
				ui.mouse.y = closestY;
			}
		}
	},
	onMouseUp = (event: MouseEvent) => {
		if (event.buttons == 0) {
			ui.mouse.down = false;
		}
	};
