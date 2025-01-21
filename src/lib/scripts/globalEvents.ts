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
			const wheelDelta =
					-event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.001),
				zoomScale = 1 + wheelDelta;

			myCanvas.offsetX += event.pageX - (event.pageX - myCanvas.offsetX) * (zoomScale - 1);
			myCanvas.offsetY += event.pageY - (event.pageY - myCanvas.offsetX) * (zoomScale - 1);
			myCanvas.scale *= zoomScale;
		}
		// myCanvas.zoomDelta(event.deltaY * -0.001);
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
		ui.mouse.x = myCanvas.d3Scale.x.invert(event.pageX);
		ui.mouse.y = myCanvas.d3Scale.y.invert(event.pageY);
	};
