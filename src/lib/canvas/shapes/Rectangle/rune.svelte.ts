import { Shape } from "../index.svelte";
import { Point } from "../../point/rune.svelte";

export class Rectangle extends Shape {
	// Rectangle center
	cx = $state(0);
	cy = $state(0);

	// Rectangle width and height
	#width = $state(0);
	#height = $state(0);

	// Reference point
	referencePoint = $state("leftLower" as keyof typeof this.points);

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
		leftLower: new Point(this, {
			xGetter: () => {
				return this.cx - 0.5 * this.#width;
			},
			yGetter: () => {
				return this.cy - 0.5 * this.#height;
			},
			xMover: (value) => {
				this.cx = value + 0.5 * this.#width;
				return value;
			},
			xResizer: (value) => {
				this.width = 2 * (this.cx - value);
				return value;
			},
			yMover: (value) => {
				this.cy = value + 0.5 * this.#height;
				return value;
			},
			yResizer: (value) => {
				this.height = 2 * (this.cy - value);
				return value;
			},
		}),
		middleLeft: new Point(this, {
			xGetter: () => {
				return this.cx - 0.5 * this.#width;
			},
			yGetter: () => {
				return this.cy;
			},
			xMover: (value) => {
				this.cx = value + 0.5 * this.#width;
				return value;
			},
			xResizer: (value) => {
				this.width = 2 * (this.cx - value);
				return value;
			},
			yMover: (value) => {
				this.cy = value;
				return value;
			},
			// Standard Y resizing
		}),
		leftUpper: new Point(this, {
			xGetter: () => {
				return this.cx - 0.5 * this.#width;
			},
			yGetter: () => {
				return this.cy + 0.5 * this.#height;
			},
			xMover: (value) => {
				this.cx = value + 0.5 * this.#width;
				return value;
			},
			xResizer: (value) => {
				this.width = 2 * (this.cx - value);
				return value;
			},
			yMover: (value) => {
				this.cy = value - 0.5 * this.#height;
				return value;
			},
			yResizer: (value) => {
				this.height = 2 * (value - this.cy);
				return value;
			},
		}),
		rightLower: new Point(this, {
			xGetter: () => {
				return this.cx + 0.5 * this.#width;
			},
			yGetter: () => {
				return this.cy - 0.5 * this.#height;
			},
			xMover: (value) => {
				this.cx = value - 0.5 * this.#width;
				return value;
			},
			xResizer: (value) => {
				this.width = 2 * (value - this.cx);
				return value;
			},
			yMover: (value) => {
				this.cy = value + 0.5 * this.#height;
				return value;
			},
			yResizer: (value) => {
				this.height = 2 * (this.cy - value);
				return value;
			},
		}),
		middleRight: new Point(this, {
			xGetter: () => {
				return this.cx + 0.5 * this.#width;
			},
			yGetter: () => {
				return this.cy;
			},
			xMover: (value) => {
				this.cx = value - 0.5 * this.#width;
				return value;
			},
			xResizer: (value) => {
				this.width = 2 * (value - this.cx);
				return value;
			},
			yMover: (value) => {
				this.cy = value;
				return value;
			},
			// Standard Y resizing
		}),
		rightUpper: new Point(this, {
			xGetter: () => {
				return this.cx + 0.5 * this.#width;
			},
			yGetter: () => {
				return this.cy + 0.5 * this.#height;
			},
			xMover: (value) => {
				this.cx = value - 0.5 * this.#width;
				return value;
			},
			xResizer: (value) => {
				this.width = 2 * (value - this.cx);
				return value;
			},
			yMover: (value) => {
				this.cy = value - 0.5 * this.#height;
				return value;
			},
			yResizer: (value) => {
				this.height = 2 * (value - this.cy);
				return value;
			},
		}),
		middleUpper: new Point(this, {
			xGetter: () => {
				return this.cx;
			},
			yGetter: () => {
				return this.cy + 0.5 * this.#height;
			},
			xMover: (value) => {
				this.cx = value;
				return value;
			},
			// Standard X resizing
			yMover: (value) => {
				this.cy = value - 0.5 * this.#height;
				return value;
			},
			yResizer: (value) => {
				this.height = 2 * (value - this.cy);
				return value;
			},
		}),
		middleLower: new Point(this, {
			xGetter: () => {
				return this.cx;
			},
			yGetter: () => {
				return this.cy - 0.5 * this.#height;
			},
			xMover: (value) => {
				this.cx = value;
				return value;
			},
			// Standard X resizing
			yMover: (value) => {
				this.cy = value + 0.5 * this.#height;
				return value;
			},
			yResizer: (value) => {
				this.height = 2 * (this.cy - value);
				return value;
			},
		}),
	} as Record<string, Point>;

	// Derived properties
	properties = $derived({
		area: this.width * this.height,
		cX: this.points.leftLower.x + 0.5 * this.width,
		cY: this.points.leftLower.y + 0.5 * this.height,
		iX: (this.width * this.height ** 3) / 12,
		iY: (this.height * this.width ** 3) / 12,
		iXY: 0,
	});

	// Getters & Setters
	get width() {
		return this.#width;
	}

	set width(value: number) {
		if (value < 0) {
			this.referencePoint = this.swapReferencePoint("width", this.referencePoint);
			this.#width = -value;
		} else {
			this.#width = value;
		}
	}

	// Height
	get height() {
		return this.#height;
	}

	set height(value: number) {
		if (value < 0) {
			this.referencePoint = this.swapReferencePoint("height", this.referencePoint);
			this.#height = -value;
		} else {
			this.#height = value;
		}
	}

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
		this.points[this.referencePoint].xMove(refX);
		this.points[this.referencePoint].yMove(refY);
	}

	// Reference point swapping logic
	swapReferencePoint(
		dimension: "width" | "height",
		point: Rectangle["referencePoint"]
	): Rectangle["referencePoint"] {
		const swaps = {
			width: {
				leftLower: "rightLower",
				rightLower: "leftLower",
				middleLeft: "middleRight",
				middleRight: "middleLeft",
				leftUpper: "rightUpper",
				rightUpper: "leftUpper",
			},
			height: {
				leftLower: "leftUpper",
				leftUpper: "leftLower",
				middleLower: "middleUpper",
				middleUpper: "middleLower",
				rightLower: "rightUpper",
				rightUpper: "rightLower",
			},
		} as {
			width: Record<Rectangle["referencePoint"], Rectangle["referencePoint"]>;
			height: Record<Rectangle["referencePoint"], Rectangle["referencePoint"]>;
		};

		return swaps[dimension][point];
	}
}
