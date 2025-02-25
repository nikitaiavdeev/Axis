import { Shape } from "../index.svelte";
import { Point } from "../../point/rune.svelte";
import { myCanvas } from "$lib/runes/canvas.svelte";

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
			xSetter: (value) => {
				this.cx = value;
				return value;
			},
			ySetter: (value) => {
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
			xSetter: (value) => {
				if (myCanvas.activeElementMode === "resize") {
					this.#width = 2 * (this.cx - value);
				} else {
					this.cx = value + 0.5 * this.#width;
				}

				return value;
			},
			ySetter: (value) => {
				if (myCanvas.activeElementMode === "resize") {
					this.#height = 2 * (this.cy - value);
				} else {
					this.cy = value + 0.5 * this.#height;
				}
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
			xSetter: (value) => {
				if (myCanvas.activeElementMode === "resize") {
					this.#width = 2 * (this.cx - value);
				} else {
					this.cx = value + 0.5 * this.#width;
				}
				return value;
			},
			ySetter: (value) => {
				if (myCanvas.activeElementMode === "resize") {
					return value;
				} else {
					this.cy = value;
					return value;
				}
			},
		}),
		leftUpper: new Point(this, {
			xGetter: () => {
				return this.cx - 0.5 * this.#width;
			},
			yGetter: () => {
				return this.cy + 0.5 * this.#height;
			},
			xSetter: (value) => {
				if (myCanvas.activeElementMode === "resize") {
					this.#width = this.cx - value;
				} else {
					this.cx = value + 0.5 * this.#width;
				}
				return value;
			},
			ySetter: (value) => {
				if (myCanvas.activeElementMode === "resize") {
					this.#height = value - this.cy;
				} else {
					this.cy = value - 0.5 * this.#height;
				}
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
			xSetter: (value) => {
				if (myCanvas.activeElementMode === "resize") {
					this.#width = 2 * (value - this.cx);
				} else {
					this.cx = value - 0.5 * this.#width;
				}
				return value;
			},
			ySetter: (value) => {
				if (myCanvas.activeElementMode === "resize") {
					this.#height = 2 * (this.cy - value);
				} else {
					this.cy = value + 0.5 * this.#height;
				}
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
			xSetter: (value) => {
				if (myCanvas.activeElementMode === "resize") {
					this.#width = 2 * (value - this.cx);
				} else {
					this.cx = value - 0.5 * this.#width;
				}
				return value;
			},
			ySetter: (value) => {
				if (myCanvas.activeElementMode === "resize") {
					return value;
				} else {
					this.cy = value;
					return value;
				}
			},
		}),
		rightUpper: new Point(this, {
			xGetter: () => {
				return this.cx + 0.5 * this.#width;
			},
			yGetter: () => {
				return this.cy + 0.5 * this.#height;
			},
			xSetter: (value) => {
				if (myCanvas.activeElementMode === "resize") {
					this.#width = 2 * (value - this.cx);
				} else {
					this.cx = value - 0.5 * this.#width;
				}
				return value;
			},
			ySetter: (value) => {
				if (myCanvas.activeElementMode === "resize") {
					this.#height = 2 * (value - this.cy);
				} else {
					this.cy = value - 0.5 * this.#height;
				}
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
			xSetter: (value) => {
				if (myCanvas.activeElementMode === "resize") {
					return value;
				} else {
					this.cx = value;
					return value;
				}
			},
			ySetter: (value) => {
				if (myCanvas.activeElementMode === "resize") {
					this.#height = 2 * (value - this.cy);
				} else {
					this.cy = value - 0.5 * this.#height;
				}
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
			xSetter: (value) => {
				if (myCanvas.activeElementMode === "resize") {
					return value;
				} else {
					this.cx = value;
					return value;
				}
			},
			ySetter: (value) => {
				if (myCanvas.activeElementMode === "resize") {
					this.#height = 2 * (this.cy - value);
				} else {
					this.cy = value + 0.5 * this.#height;
				}
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

	// Height
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
