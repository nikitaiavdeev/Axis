// Classes
import { Shape } from "../index.svelte";
import { Point } from "../../point/rune.svelte";
import { myCanvas } from "$lib/runes/canvas.svelte";

// Rectangle shape class, extends Shape
export class Rectangle extends Shape {
	// Points defining the rectangle and their behaviors
	points = {
		center: new Point(this, {
			name: "center" as keyof typeof this.points,
			resizeCursor: "move",
		}),
		leftLower: new Point(this, {
			name: "leftLower" as keyof typeof this.points,
			resizeCursor: "ne-resize",
			affectedPointsScales: {
				x: [0.5, 1, 1, 1, 0, 0, 0, 0.5, 0.5],
				y: [0.5, 1, 0.5, 0, 1, 0.5, 0, 0, 1],
			},
		}),
		middleLeft: new Point(this, {
			name: "middleLeft" as keyof typeof this.points,
			resizeCursor: "e-resize",
			affectedPointsScales: {
				x: [0.5, 1, 1, 1, 0, 0, 0, 0.5, 0.5],
				y: [],
			},
		}),
		leftUpper: new Point(this, {
			name: "leftUpper" as keyof typeof this.points,
			resizeCursor: "nw-resize",
			affectedPointsScales: {
				x: [0.5, 1, 1, 1, 0, 0, 0, 0.5, 0.5],
				y: [0.5, 0, 0.5, 1, 0, 0.5, 1, 1, 0],
			},
		}),
		rightLower: new Point(this, {
			name: "rightLower" as keyof typeof this.points,
			resizeCursor: "nw-resize",
			affectedPointsScales: {
				x: [0.5, 0, 0, 0, 1, 1, 1, 0.5, 0.5],
				y: [0.5, 1, 0.5, 0, 1, 0.5, 0, 0, 1],
			},
		}),
		middleRight: new Point(this, {
			name: "middleRight" as keyof typeof this.points,
			resizeCursor: "e-resize",
			affectedPointsScales: {
				x: [0.5, 0, 0, 0, 1, 1, 1, 0.5, 0.5],
				y: [],
			},
		}),
		rightUpper: new Point(this, {
			name: "rightUpper" as keyof typeof this.points,
			resizeCursor: "ne-resize",
			affectedPointsScales: {
				x: [0.5, 0, 0, 0, 1, 1, 1, 0.5, 0.5],
				y: [0.5, 0, 0.5, 1, 0, 0.5, 1, 1, 0],
			},
		}),
		middleUpper: new Point(this, {
			name: "middleUpper" as keyof typeof this.points,
			resizeCursor: "n-resize",
			affectedPointsScales: {
				x: [],
				y: [0.5, 0, 0.5, 1, 0, 0.5, 1, 1, 0],
			},
		}),
		middleLower: new Point(this, {
			name: "middleLower" as keyof typeof this.points,
			resizeCursor: "n-resize",
			affectedPointsScales: {
				x: [],
				y: [0.5, 1, 0.5, 0, 1, 0.5, 0, 0, 1],
			},
		}),
	} as {
		center: Point;
		leftLower: Point;
		middleLeft: Point;
		leftUpper: Point;
		rightLower: Point;
		middleRight: Point;
		rightUpper: Point;
		middleUpper: Point;
		middleLower: Point;
	};

	// Reference point for transformations (default: leftLower)
	referencePoint = $state(this.points.leftLower);
	// Currently edited point (if any)
	editedPoint = $state(undefined as undefined | Point);

	/**
	 * Rectangle constructor
	 * @param refX - Initial X coordinate
	 * @param refY - Initial Y coordinate
	 * @param referencePoint - Which point to use as reference (default: leftLower)
	 * @param isHole - Whether this rectangle is a hole (default: false)
	 */
	constructor(
		refX: number,
		refY: number,
		{ referencePoint = "leftLower" as keyof Rectangle["points"], isHole = false }
	) {
		super(isHole);

		this.referencePoint = this.points[referencePoint];
		this.editedPoint = this.referencePoint;

		// Initialize all points at the reference position and set affected points
		for (const point of Object.values(this.points)) {
			point.x = refX;
			point.y = refY;
			point.affectedPoints = Object.values(this.points);
		}
	}

	// Get rectangle width (distance between middleRight and middleLeft X)
	get width() {
		return this.points.middleRight.x - this.points.middleLeft.x;
	}
	// Get rectangle height (distance between middleUpper and middleLower Y)
	get height() {
		return this.points.middleUpper.y - this.points.middleLower.y;
	}

	/**
	 * Swaps the edited and reference points if the rectangle's width or height would become negative.
	 * This ensures the rectangle is always defined with positive dimensions.
	 */
	swapEditedPoint() {
		if (!this.editedPoint) return;

		const swaps = {
			width: {
				leftLower: this.points.rightLower,
				rightLower: this.points.leftLower,
				middleLeft: this.points.middleRight,
				middleRight: this.points.middleLeft,
				leftUpper: this.points.rightUpper,
				rightUpper: this.points.leftUpper,
			},
			height: {
				leftLower: this.points.leftUpper,
				leftUpper: this.points.leftLower,
				middleLower: this.points.middleUpper,
				middleUpper: this.points.middleLower,
				rightLower: this.points.rightUpper,
				rightUpper: this.points.rightLower,
			},
		} as {
			width: Record<keyof Rectangle["points"], Point>;
			height: Record<keyof Rectangle["points"], Point>;
		};

		// Swap points if width will be negative
		if (
			(myCanvas.mouse.x < this.points.middleLeft.x &&
				[this.points.rightLower, this.points.rightUpper, this.points.middleRight].includes(
					this.editedPoint
				)) ||
			(myCanvas.mouse.x > this.points.middleRight.x &&
				[this.points.leftLower, this.points.leftUpper, this.points.middleLeft].includes(
					this.editedPoint
				))
		) {
			if (this.editedPoint !== this.referencePoint) {
				this.referencePoint = swaps["width"][this.referencePoint.name as keyof typeof this.points];
			}
			this.editedPoint = swaps["width"][this.editedPoint.name as keyof typeof this.points];

			if (myCanvas.editShape instanceof Point) {
				myCanvas.editShape = this.editedPoint;
			}
		}

		// Swap points if height will be negative
		if (
			(myCanvas.mouse.y < this.points.middleLower.y &&
				[this.points.leftUpper, this.points.rightUpper, this.points.middleUpper].includes(
					this.editedPoint
				)) ||
			(myCanvas.mouse.y > this.points.middleUpper.y &&
				[this.points.leftLower, this.points.rightLower, this.points.middleLower].includes(
					this.editedPoint
				))
		) {
			if (this.editedPoint !== this.referencePoint) {
				this.referencePoint = swaps["height"][this.referencePoint.name as keyof typeof this.points];
			}
			this.editedPoint = swaps["height"][this.editedPoint.name as keyof typeof this.points];

			if (myCanvas.editShape instanceof Point) {
				myCanvas.editShape = this.editedPoint;
			}
		}
	}

	/**
	 * Returns the point opposite to the current reference point.
	 * Used for resizing and transformations.
	 */
	oppositePoint(): Point {
		const swaps = {
			center: this.points.center,
			leftLower: this.points.rightUpper,
			rightLower: this.points.leftUpper,
			leftUpper: this.points.rightLower,
			rightUpper: this.points.leftLower,
			middleLeft:
				myCanvas.mouse.y > this.points.middleLeft.y
					? this.points.rightUpper
					: this.points.rightLower,
			middleRight:
				myCanvas.mouse.y > this.points.middleRight.y
					? this.points.leftUpper
					: this.points.leftLower,
			middleLower:
				myCanvas.mouse.x > this.points.middleLower.x
					? this.points.rightUpper
					: this.points.leftUpper,
			middleUpper:
				myCanvas.mouse.x > this.points.middleUpper.x
					? this.points.rightLower
					: this.points.leftLower,
		};

		return swaps[this.referencePoint.name as keyof typeof this.points];
	}

	// // Reference point swapping logic (unused, kept for reference)
	// swapReferencePoint(dimension: "width" | "height", point: Point): Point {
	// 	const swaps = {
	// 		width: {
	// 			leftLower: this.points.rightLower,
	// 			rightLower: this.points.leftLower,
	// 			middleLeft: this.points.middleRight,
	// 			middleRight: this.points.middleLeft,
	// 			leftUpper: this.points.rightUpper,
	// 			rightUpper: this.points.leftUpper,
	// 		},
	// 		height: {
	// 			leftLower: this.points.leftUpper,
	// 			leftUpper: this.points.leftLower,
	// 			middleLower: this.points.middleUpper,
	// 			middleUpper: this.points.middleLower,
	// 			rightLower: this.points.rightUpper,
	// 			rightUpper: this.points.rightLower,
	// 		},
	// 	} as {
	// 		width: Record<keyof Rectangle["points"], Point>;
	// 		height: Record<keyof Rectangle["points"], Point>;
	// 	};

	// 	return swaps[dimension][point.name as keyof typeof this.points];
	// }

	// Derived geometric properties of the rectangle
	properties = $derived({
		area: this.width * this.height, // Area of the rectangle
		cX: this.points.leftLower.x + 0.5 * this.width, // Center X
		cY: this.points.leftLower.y + 0.5 * this.height, // Center Y
		iX: (this.width * this.height ** 3) / 12, // Moment of inertia X
		iY: (this.height * this.width ** 3) / 12, // Moment of inertia Y
		iXY: 0, // Product of inertia (always 0 for axis-aligned rectangle)
	});
}
