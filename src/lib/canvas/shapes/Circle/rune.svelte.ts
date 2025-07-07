// Classes
import { Shape } from "../index.svelte";
import { Point } from "../../point/rune.svelte";
import { myCanvas } from "$lib/runes/canvas.svelte";

export class Circle extends Shape {
	// Circle center
	cx = $state(0);
	cy = $state(0);

	// Circle radius
	#radius = $state(0);

	// Reference point
	referencePoint = $state<keyof typeof this.points>("center");

	// Points
	points = {
		center: new Point(this, {
			xGetter: () => {
				return this.cx;
			},
			yGetter: () => {
				return this.cy;
			},
			xMover: (value) => {
				this.cx = value;
				return value;
			},
			xResizer: (value) => {
				this.cx = value;
				return value;
			},
			yMover: (value) => {
				this.cy = value;
				return value;
			},
			yResizer: (value) => {
				this.cy = value;
				return value;
			},
		}),
		middleLeft: new Point(this, {
			xGetter: () => {
				return this.cx - this.#radius;
			},
			yGetter: () => {
				return this.cy;
			},
			xMover: (value) => {
				this.cx = value + this.#radius;
				return value;
			},
			xResizer: (value) => {
				this.radius = this.cx - value;
				return value;
			},
			yMover: (value) => {
				this.cy = value;
				return value;
			},
			// Standard Y resizing
		}),
		middleRight: new Point(this, {
			xGetter: () => {
				return this.cx + this.#radius;
			},
			yGetter: () => {
				return this.cy;
			},
			xMover: (value) => {
				this.cx = value - this.#radius;
				return value;
			},
			xResizer: (value) => {
				this.radius = value - this.cx;
				return value;
			},
			yMover: (value) => {
				this.cy = value;
				return value;
			},
			// Standard Y resizing
		}),
		middleUpper: new Point(this, {
			xGetter: () => {
				return this.cx;
			},
			yGetter: () => {
				return this.cy + this.#radius;
			},
			xMover: (value) => {
				this.cx = value;
				return value;
			},
			// Standard X resizing
			yMover: (value) => {
				this.cy = value - this.#radius;
				return value;
			},
			yResizer: (value) => {
				this.radius = value - this.cy;
				return value;
			},
		}),
		middleLower: new Point(this, {
			xGetter: () => {
				return this.cx;
			},
			yGetter: () => {
				return this.cy - this.#radius;
			},
			xMover: (value) => {
				this.cx = value;
				return value;
			},
			// Standard X resizing
			yMover: (value) => {
				this.cy = value + this.#radius;
				return value;
			},
			yResizer: (value) => {
				this.radius = this.cy - value;
				return value;
			},
		}),
	} as {
		center: Point;
		middleLeft: Point;
		middleRight: Point;
		middleUpper: Point;
		middleLower: Point;
	};

	// Getters & Setters
	get radius() {
		return this.#radius;
	}

	set radius(value: number) {
		if (value < 0) {
			this.referencePoint = this.swapReferencePoint(this.referencePoint);
			this.#radius = -value;
		} else {
			this.#radius = value;
		}
	}

	// Radius scaled to svg canvas scale
	radiusD3scale = $derived(myCanvas.d3Scale.x(this.radius));

	constructor(
		refX: number,
		refY: number,
		radius: number,
		referencePoint = "center" as Circle["referencePoint"],
		isHole = false
	) {
		super(isHole);

		this.radius = radius;

		this.referencePoint = referencePoint;

		// Set reference point coordinates
		this.points[this.referencePoint].xMove(refX);
		this.points[this.referencePoint].yMove(refY);
	}

	// Reference point swapping logic
	swapReferencePoint(point: Circle["referencePoint"]): Circle["referencePoint"] {
		const swaps = {
			middleLeft: "middleRight",
			middleRight: "middleLeft",
			middleLower: "middleUpper",
			middleUpper: "middleLower",
		} as Record<Circle["referencePoint"], Circle["referencePoint"]>;

		return swaps[point];
	}

	// Derived properties
	properties = $derived({
		area: Math.PI * this.#radius ** 2,
		cX: this.cx,
		cY: this.cy,
		iX: 0.25 * Math.PI * this.#radius ** 4,
		iY: 0.25 * Math.PI * this.#radius ** 4,
		iXY: 0,
	});
}
