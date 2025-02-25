import { Shape } from "../index.svelte";
import { DependendPoint, IndependentPoint, Point } from "../../point/rune.svelte";

export class Rectangle extends Shape {
	#width = $state(0);
	#height = $state(0);

	// Points
	points = {
		center: new Point(0, 0, this),

		leftLower: new DependendPoint(-0.5 * this.width, -0.5 * this.height, this.#center),
		middleLeft: new DependendPoint(-0.5 * this.width, 0, this.#center),
		leftUpper: new DependendPoint(-0.5 * this.width, 0.5 * this.height, this.#center),

		rightLower: new DependendPoint(0.5 * this.width, -0.5 * this.height, this.#center),
		middleRight: new DependendPoint(0.5 * this.width, 0, this.#center),
		rightUpper: new DependendPoint(0.5 * this.width, 0.5 * this.height, this.#center),

		middleUpper: new DependendPoint(0, 0.5 * this.height, this.#center),
		middleLower: new DependendPoint(0, -0.5 * this.height, this.#center),
	};

	// Reference point
	referencePoint = $state("leftLower" as keyof typeof this.points);

	// Derived properties
	properties = $derived({
		area: this.width * this.height,
		cX: this.points.leftLower.x + 0.5 * this.width,
		cY: this.points.leftLower.y + 0.5 * this.height,
		iX: (this.width * this.height ** 3) / 12,
		iY: (this.height * this.width ** 3) / 12,
		iXY: 0,
	});

	constructor(
		refX: number,
		refY: number,
		width: number,
		height: number,
		referencePoint = "leftLower" as Rectangle["referencePoint"],
		isHole = false
	) {
		super(isHole);

		this.width = width;
		this.height = height;

		this.referencePoint = referencePoint;

		// Set reference point coordinates
		this.points[this.referencePoint].x = refX;
		this.points[this.referencePoint].y = refY;
	}

	// Width
	get width() {
		return this.#width;
	}

	set width(value: number) {
		if (value < 0) {
			// Swap reference point if width is negative
			switch (this.referencePoint) {
				case "leftLower":
					this.referencePoint = "rightLower";
					break;
				case "rightLower":
					this.referencePoint = "leftLower";
					break;
				case "middleLeft":
					this.referencePoint = "middleRight";
					break;
				case "middleRight":
					this.referencePoint = "middleLeft";
					break;
				case "leftUpper":
					this.referencePoint = "rightUpper";
					break;
				case "rightUpper":
					this.referencePoint = "leftUpper";
					break;
			}
			this.#width = -value;
		} else {
			this.#width = value;
		}
	}

	// height
	get height() {
		return this.#height;
	}

	set height(value: number) {
		if (value < 0) {
			// Swap reference point if height is negative
			switch (this.referencePoint) {
				case "leftLower":
					this.referencePoint = "leftUpper";
					break;
				case "leftUpper":
					this.referencePoint = "leftLower";
					break;
				case "middleLower":
					this.referencePoint = "middleUpper";
					break;
				case "middleUpper":
					this.referencePoint = "middleLower";
					break;
				case "rightLower":
					this.referencePoint = "rightUpper";
					break;
				case "rightUpper":
					this.referencePoint = "rightLower";
					break;
			}
			this.#height = -value;
		} else {
			this.#height = value;
		}
	}

	// Reference point coordinates
	get refX() {
		return this.points[this.referencePoint].x;
	}

	set refX(value: number) {
		this.points[this.referencePoint].x = value;
	}

	get refY() {
		return this.points[this.referencePoint].y;
	}

	set refY(value: number) {
		this.points[this.referencePoint].y = value;
	}
}
