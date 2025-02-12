import { myCanvas } from "$lib/runes/canvas.svelte";
import { Point } from "../Point/rune.svelte";

export enum ReferencePoint {
	middleLeft,
	middleUpper,
	middleRight,
	middleLower,
	center,
}

export class Circle {
	refX = $state(0);
	refY = $state(0);
	radius = $state(0);

	referencePoint = $state(ReferencePoint.center);
	isHole = $state(false);

	centerX = $derived.by(() => {
		switch (this.referencePoint) {
			case ReferencePoint.middleLeft:
				return this.refX + this.radius;
			case ReferencePoint.middleRight:
				return this.refX - this.radius;
			case ReferencePoint.middleLower:
			case ReferencePoint.middleUpper:
			case ReferencePoint.center:
				return this.refX;
		}
	});

	centerY = $derived.by(() => {
		switch (this.referencePoint) {
			case ReferencePoint.middleLower:
				return this.refY + this.radius;
			case ReferencePoint.middleUpper:
				return this.refY - this.radius;
			case ReferencePoint.middleLeft:
			case ReferencePoint.middleRight:
			case ReferencePoint.center:
				return this.refY;
		}
	});

	radiusD3scale = $derived(myCanvas.d3Scale.x(this.radius));

	points = {
		middleLeft: new Point(
			() => this.centerX - this.radius,
			() => this.centerY
		),
		middleUpper: new Point(
			() => this.centerX,
			() => this.centerY + this.radius
		),
		middleRight: new Point(
			() => this.centerX + this.radius,
			() => this.centerY
		),
		middleLower: new Point(
			() => this.centerX,
			() => this.centerY - this.radius
		),
		center: new Point(
			() => this.centerX,
			() => this.centerY
		),
	};

	constructor(
		refX: number,
		refY: number,
		radius: number,
		referencePoint = ReferencePoint.center,
		isHole = false
	) {
		this.refX = refX;
		this.refY = refY;
		this.radius = radius;

		this.referencePoint = referencePoint;
		this.isHole = isHole;
	}

	clean() {
		// Delete shape
		const idx = myCanvas.shapes.findIndex((s) => s === this);
		if (idx >= 0) {
			myCanvas.shapes.splice(idx, 1);
		}

		// Delete all nodes
		Object.values(this.points).forEach((point) => point.clean());
	}

	properties = $derived({
		area: Math.PI * this.radius ** 2,
		cX: this.centerX,
		cY: this.centerY,
		iX: 0.25 * Math.PI * this.radius ** 4,
		iY: 0.25 * Math.PI * this.radius ** 4,
		iXY: 0,
	});
}
