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
	width = $state(2);
	height = $state(1);
	angle = $state(0);
	isHole = $state(false);

	get area(): number {
		return this.width * this.height;
	}
}
