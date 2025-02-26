// Math
import { vec2 } from "gl-matrix";

// Runes
import { anchorPoints } from "$lib/canvas/point/rune.svelte";
import { myCanvas } from "$lib/runes/canvas.svelte";

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
		if (myCanvas.mouse.down) {
			window.getSelection()?.removeAllRanges();
		}

		if (event.buttons == 4) {
			document.body.style.cursor = "grabbing";
			myCanvas.offsetX += event.movementX;
			myCanvas.offsetY += event.movementY;
			return;
		}

		document.body.style.cursor = "auto";

		myCanvas.mouse.x = myCanvas.mouseScale.x.invert(event.pageX);
		myCanvas.mouse.y = myCanvas.mouseScale.y.invert(event.pageY);

		// Magnet mouse location
		if (myCanvas.uiOptions.magnet) {
			// Magnet to points
			const closestPointID = anchorPoints.delaunay.find(myCanvas.mouse.x, myCanvas.mouse.y),
				distanceToPixelsScale = 2 * myCanvas.consts.GRID_SIZE * myCanvas.scale;

			if (closestPointID > -1) {
				const closestPointXY = vec2.fromValues(
						anchorPoints.list[closestPointID].x,
						anchorPoints.list[closestPointID].y
					),
					distance = vec2.dist(vec2.fromValues(myCanvas.mouse.x, myCanvas.mouse.y), closestPointXY);

				if (distance * distanceToPixelsScale < 20) {
					myCanvas.mouse.x = closestPointXY[0];
					myCanvas.mouse.y = closestPointXY[1];
					return;
				}
			}

			// Magnet to grid
			const closestX = Math.round(myCanvas.mouse.x / 0.1) * 0.1,
				closestY = Math.round(myCanvas.mouse.y / 0.1) * 0.1;

			if (Math.abs(myCanvas.mouse.x - closestX) * distanceToPixelsScale < 20) {
				myCanvas.mouse.x = closestX;
			}
			if (Math.abs(myCanvas.mouse.y - closestY) * distanceToPixelsScale < 20) {
				myCanvas.mouse.y = closestY;
			}
		}
	},
	onMouseUp = (event: MouseEvent) => {
		if (event.buttons == 0) {
			myCanvas.mouse.down = false;
		}
	};
