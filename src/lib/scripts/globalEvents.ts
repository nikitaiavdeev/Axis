// Math
import { vec2 } from "gl-matrix";

// Runes
import { anchorPoints } from "$lib/canvas/point/rune.svelte";
import { myCanvas } from "$lib/runes/canvas.svelte";

// Constants
import { GRID_SIZE_PIXELS } from "$lib/constants.js";
import { Rectangle } from "$lib/canvas/shapes/Rectangle/rune.svelte";

// Timer for mouse down event (used to distinguish click vs hold)
let mouseDownTimer = undefined as undefined | number;

/**
 * Handles global key press events for canvas interactions.
 * - Zoom in/out with Ctrl + (+/-)
 * - Fit view with Ctrl + F
 * - Move canvas with Ctrl + Arrow keys
 */
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
	/**
	 * Handles mouse wheel events for zooming the canvas.
	 * Zooms in/out based on wheel delta, centered on mouse position.
	 */
	onWheel = (event: WheelEvent) => {
		// if (event.ctrlKey) {
		const zoomScale = 1 - event.deltaY * 0.001;
		myCanvas.zoomDelta(zoomScale, event.pageX, event.pageY);
		// }
	},
	/**
	 * Handles mouse move events for canvas interactions.
	 * - Updates mouse position
	 * - Handles panning with middle mouse button
	 * - Applies magnet snapping to points or grid if enabled
	 */
	onMouseMove = (event: MouseEvent) => {
		event.preventDefault();

		// Prevent selection while editing elements
		if (myCanvas.mouse.down) {
			window.getSelection()?.removeAllRanges();
		}

		// Pan canvas with middle mouse button (button 4)
		if (event.buttons == 4) {
			document.body.style.cursor = "grabbing";
			myCanvas.offsetX += event.movementX;
			myCanvas.offsetY += event.movementY;
			return;
		}

		document.body.style.cursor = "auto";

		// Update mouse position in canvas coordinates
		myCanvas.mouse.x = myCanvas.mouseScale.x.invert(event.pageX);
		myCanvas.mouse.y = myCanvas.mouseScale.y.invert(event.pageY);

		// Magnet mouse location to anchor points or grid if enabled
		if (myCanvas.uiOptions.magnet && myCanvas.activeShape) {
			// Magnet to closest anchor point
			const closestPointID = anchorPoints.delaunay.find(myCanvas.mouse.x, myCanvas.mouse.y),
				distanceToPixelsScale = 2 * GRID_SIZE_PIXELS * myCanvas.scale;

			if (closestPointID > -1) {
				const closestPointXY = vec2.fromValues(
						anchorPoints.list[closestPointID].x,
						anchorPoints.list[closestPointID].y
					),
					distance = vec2.dist(vec2.fromValues(myCanvas.mouse.x, myCanvas.mouse.y), closestPointXY);

				// Snap if close enough to anchor point
				if (distance * distanceToPixelsScale < 20) {
					myCanvas.mouse.x = closestPointXY[0];
					myCanvas.mouse.y = closestPointXY[1];
					return;
				}
			}

			// Magnet to grid (0.1 units)
			const closestX = Math.round(myCanvas.mouse.x / 0.1) * 0.1,
				closestY = Math.round(myCanvas.mouse.y / 0.1) * 0.1;

			// Snap if close enough to grid
			if (Math.abs(myCanvas.mouse.x - closestX) * distanceToPixelsScale < 20) {
				myCanvas.mouse.x = closestX;
			}
			if (Math.abs(myCanvas.mouse.y - closestY) * distanceToPixelsScale < 20) {
				myCanvas.mouse.y = closestY;
			}
		}

		// Magnet to explicitly set positions (if any)
		if (myCanvas.mouse.magnetX) myCanvas.mouse.x = myCanvas.mouse.magnetX;
		if (myCanvas.mouse.magnetY) myCanvas.mouse.y = myCanvas.mouse.magnetY;
	},
	/**
	 * Handles mouse down events.
	 * Starts a timer to distinguish between click and hold actions.
	 */
	onMouseDown = (event: MouseEvent) => {
		if (event.buttons == 1) {
			mouseDownTimer = setTimeout(() => {
				myCanvas.mouse.down = true; // Timer completed, it's a hold
			}, 200);
		}
	},
	/**
	 * Handles mouse up events.
	 * Clears the hold timer and resets mouse state.
	 * Also resets edited point for rectangles.
	 */
	onMouseUp = (event: MouseEvent) => {
		if (event.buttons == 0) {
			if (mouseDownTimer) clearTimeout(mouseDownTimer); // Clear the timer on release

			setTimeout(() => {
				myCanvas.mouse.down = false; // Timer completed, it's a hold

				if (myCanvas.editShape instanceof Rectangle) {
					myCanvas.editShape.editedPoint = undefined;
				}
			}, 50);
		}
	};
