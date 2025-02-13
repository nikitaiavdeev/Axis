import { myCanvas } from "$lib/runes/canvas.svelte";
import { Point } from "../Point/rune.svelte";

export enum ReferencePoint {
	leftLower,
	middleLeft,
	leftUpper,
	middleUpper,
	rightUpper,
	middleRight,
	rightLower,
	middleLower,
	center,
}

export class Rectangle {
	refX = $state(0);
	refY = $state(0);
	width = $state(0);
	height = $state(0);

	referencePoint = $state(ReferencePoint.leftLower);
	isHole = $state(false);

	leftLowerX = $derived.by(() => {
		switch (this.referencePoint) {
			case ReferencePoint.leftLower:
			case ReferencePoint.middleLeft:
			case ReferencePoint.leftUpper:
				return this.refX;
			case ReferencePoint.rightLower:
			case ReferencePoint.middleRight:
			case ReferencePoint.rightUpper:
				return this.refX - this.width;
			case ReferencePoint.middleLower:
			case ReferencePoint.middleUpper:
			case ReferencePoint.center:
				return this.refX - 0.5 * this.width;
		}
	});

	leftLowerY = $derived.by(() => {
		switch (this.referencePoint) {
			case ReferencePoint.leftLower:
			case ReferencePoint.middleLower:
			case ReferencePoint.rightLower:
				return this.refY;
			case ReferencePoint.leftUpper:
			case ReferencePoint.middleUpper:
			case ReferencePoint.rightUpper:
				return this.refY - this.height;
			case ReferencePoint.middleLeft:
			case ReferencePoint.middleRight:
			case ReferencePoint.center:
				return this.refY - 0.5 * this.height;
		}
	});

	points = {
		leftLower: new Point(
			() => this.leftLowerX,
			() => this.leftLowerY,
			this
		),
		middleLeft: new Point(
			() => this.leftLowerX,
			() => this.leftLowerY + 0.5 * this.height,
			this
		),
		leftUpper: new Point(
			() => this.leftLowerX,
			() => this.leftLowerY + this.height,
			this
		),
		middleUpper: new Point(
			() => this.leftLowerX + 0.5 * this.width,
			() => this.leftLowerY + this.height,
			this
		),
		rightUpper: new Point(
			() => this.leftLowerX + this.width,
			() => this.leftLowerY + this.height,
			this
		),
		middleRight: new Point(
			() => this.leftLowerX + this.width,
			() => this.leftLowerY + 0.5 * this.height,
			this
		),
		rightLower: new Point(
			() => this.leftLowerX + this.width,
			() => this.leftLowerY,
			this
		),
		middleLower: new Point(
			() => this.leftLowerX + 0.5 * this.width,
			() => this.leftLowerY,
			this
		),
		center: new Point(
			() => this.leftLowerX + 0.5 * this.width,
			() => this.leftLowerY + 0.5 * this.height,
			this
		),
	};

	constructor(
		refX: number,
		refY: number,
		width: number,
		height: number,
		referencePoint = ReferencePoint.leftLower,
		isHole = false
	) {
		this.refX = refX;
		this.refY = refY;
		this.width = width;
		this.height = height;

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
		area: this.width * this.height,
		cX: this.leftLowerX + 0.5 * this.width,
		cY: this.leftLowerY + 0.5 * this.height,
		iX: (this.width * this.height ** 3) / 12,
		iY: (this.height * this.width ** 3) / 12,
		iXY: 0,
	});
}
