<script lang="ts">
	import { myCanvas } from "$lib/runes/canvas.svelte";
	import { Rectangle, ReferencePoint } from "./rectangleRune.svelte";

	let { rect }: { rect: Rectangle } = $props();

	let rectX = $derived.by(() => {
			switch (rect.referencePoint) {
				case ReferencePoint.leftLower:
				case ReferencePoint.leftUpper:
					return rect.refX;
				case ReferencePoint.rightLower:
				case ReferencePoint.rightUpper:
					return rect.refX - rect.width;
				case ReferencePoint.center:
					return rect.refX - 0.5 * rect.width;
			}
		}),
		rectY = $derived.by(() => {
			switch (rect.referencePoint) {
				case ReferencePoint.leftLower:
				case ReferencePoint.rightLower:
					return rect.refY;
				case ReferencePoint.leftUpper:
				case ReferencePoint.rightUpper:
					return rect.refY - rect.height;
				case ReferencePoint.center:
					return rect.refY - 0.5 * rect.height;
			}
		});

	const onDrag = (event: MouseEvent) => {
		console.log(event);
	};
</script>

<rect class="shape" x={rectX} y={rectY} width={rect.width} height={rect.height}></rect>
<circle
	class="point"
	cx={rectX}
	cy={rectY}
	r={4 / myCanvas.scale}
	onmousedown={(event) => onDrag(event)}></circle>
<circle class="point" cx={rectX} cy={rectY + rect.height} r={4 / myCanvas.scale}></circle>
<circle class="point" cx={rectX + rect.width} cy={rectY} r={4 / myCanvas.scale}></circle>
<circle class="point" cx={rectX + rect.width} cy={rectY + rect.height} r={4 / myCanvas.scale}
></circle>
