// Runes
import { myCanvas } from "$lib/runes/canvas.svelte";
import { ui } from "$lib/runes/ui.svelte";

export const keyPressEvent = (event: KeyboardEvent) => {
		// Canvas zoom in
		if (event.ctrlKey && event.key == "+") {
			event.preventDefault();
			myCanvas.zoomIn();
			return;
		}

		// Canvas zoom out
		if (event.ctrlKey && event.key == "-") {
			event.preventDefault();
			myCanvas.zoomOut();
			return;
		}
	},
	onWheel = (event: WheelEvent) => {
		if (event.ctrlKey) {
			const zoomScale = 1 - event.deltaY * 0.001;
			myCanvas.zoomDelta(zoomScale, event.pageX, event.pageY);
		}
	},
	onMouseMove = (event: MouseEvent) => {
		event.preventDefault();

		if (event.buttons == 4) {
			document.body.style.cursor = "grabbing";
			myCanvas.offsetX += event.movementX;
			myCanvas.offsetY += event.movementY;
			return;
		}

		document.body.style.cursor = "auto";
		ui.mouse.x = myCanvas.mouseScale.x.invert(event.pageX);
		ui.mouse.y = myCanvas.mouseScale.y.invert(event.pageY);
	};
