<script lang="ts">
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Rectangle, ReferencePoint } from "./rectangleRune.svelte";

	let { rect }: { rect: Rectangle } = $props();

	let rectX = $derived.by(() => {
			switch (rect.referencePoint) {
				case ReferencePoint.leftLower:
				case ReferencePoint.middleLeft:
				case ReferencePoint.leftUpper:
					return rect.refX;
				case ReferencePoint.rightLower:
				case ReferencePoint.middleRight:
				case ReferencePoint.rightUpper:
					return rect.refX - rect.width;
				case ReferencePoint.middleLower:
				case ReferencePoint.middleUpper:
				case ReferencePoint.center:
					return rect.refX - 0.5 * rect.width;
			}
		}),
		rectY = $derived.by(() => {
			switch (rect.referencePoint) {
				case ReferencePoint.leftLower:
				case ReferencePoint.middleLower:
				case ReferencePoint.rightLower:
					return rect.refY;
				case ReferencePoint.leftUpper:
				case ReferencePoint.middleUpper:
				case ReferencePoint.rightUpper:
					return rect.refY - rect.height;
				case ReferencePoint.middleLeft:
				case ReferencePoint.middleRight:
				case ReferencePoint.center:
					return rect.refY - 0.5 * rect.height;
			}
		});

	const onDrag = (event: MouseEvent) => {
		console.log(event);
	};
</script>

<rect
	class="shape"
	x={myCanvas.d3Scale.x(rectX)}
	y={myCanvas.d3Scale.y(rectY)}
	width={myCanvas.d3Scale.x(rectX + rect.width) - myCanvas.d3Scale.x(rectX)}
	height={myCanvas.d3Scale.y(rectY) - myCanvas.d3Scale.y(rectY + rect.height)}></rect>

<circle
	class="point"
	cx={myCanvas.d3Scale.x(rectX)}
	cy={myCanvas.d3Scale.y(rectY)}
	r={4 }
	role="none"
	onmousedown={(event) => onDrag(event)}></circle>
<circle
	class="point"
	cx={myCanvas.d3Scale.x(rectX)}
	cy={myCanvas.d3Scale.y(rectY + rect.height)}
	r={4 }></circle>
<circle
	class="point"
	cx={myCanvas.d3Scale.x(rectX + rect.width)}
	cy={myCanvas.d3Scale.y(rectY)}
	r={4}></circle>
<circle
	class="point"
	cx={myCanvas.d3Scale.x(rectX + rect.width)}
	cy={myCanvas.d3Scale.y(rectY + rect.height)}
	r={4 }></circle>
