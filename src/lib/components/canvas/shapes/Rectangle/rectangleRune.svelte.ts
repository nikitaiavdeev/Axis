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
	referencePoint = $state(ReferencePoint.center);
	width = $state(1);
	height = $state(1);
	angle = $state(0);
	isHole = $state(false);

	constructor(
		refX: number,
		refY: number,
		referencePoint: ReferencePoint,
		width: number,
		height: number,
		angle: number,
		isHole: boolean
	) {
		this.refX = refX;
		this.refY = refY;
		this.referencePoint = referencePoint;
		this.width = width;
		this.height = height;
		this.angle = angle;
		this.isHole = isHole;
	}

	get area(): number {
		return this.width * this.height;
	}
}
