import { myCanvas } from "$lib/runes/canvas.svelte";
import { Point } from "../Point/rune.svelte";
import { vec3 } from "gl-matrix";

export class Polygon {
	isHole = $state(false);

	points = [] as Point[];

	constructor(pointsCoord: { x: number; y: number }[], isHole = false) {
		for (const pointCoord of pointsCoord) {
			this.points[this.points.length] = new Point(
				() => pointCoord.x,
				() => pointCoord.y,
				true
			);
		}

		this.isHole = isHole;
	}

	static createFromImport(coords: number[], indices: number[], normals: number[]) {
		const normal = vec3.fromValues(normals[0], normals[1], normals[2]);

		// Check if any axis is 90deg to normal
		const vecX = vec3.fromValues(1, 0, 0),
			vecY = vec3.fromValues(0, 1, 0),
			vecZ = vec3.fromValues(0, 0, 1),
			angleX = vec3.angle(vecX, normal),
			angleY = vec3.angle(vecY, normal),
			angleZ = vec3.angle(vecZ, normal),
			projectionVecX = vec3.create(),
			projectionVecY = vec3.create();

		if (angleX < 0.000001) {
			vec3.copy(projectionVecX, vecY);
		} else if (angleY < 0.000001) {
			vec3.copy(projectionVecX, vecZ);
		} else if (angleZ < 0.000001) {
			vec3.copy(projectionVecX, vecX);
		} else if (angleX === Math.min(angleX, angleY, angleZ)) {
			vec3.cross(projectionVecX, normal, vecX);
		} else if (angleY === Math.min(angleX, angleY, angleZ)) {
			vec3.cross(projectionVecX, normal, vecY);
		} else {
			vec3.cross(projectionVecX, normal, vecZ);
		}

		vec3.cross(projectionVecY, normal, projectionVecX);

		const vertexCount = coords.length / 3,
			edges = {} as Record<string, number>,
			addEdge = (idxN: number, idxNp1: number) => {
				const edgeStr = `${Math.min(idxN, idxNp1)}-${Math.max(idxN, idxNp1)}`;

				if (edgeStr in edges) {
					edges[edgeStr] += 1;
				} else {
					edges[edgeStr] = 1;
				}
			},
			scaledCoords = [] as vec3[],
			projectedCoords = [] as { x: number; y: number }[];

		for (let i = 0; i < vertexCount; i++) {
			scaledCoords[i] = vec3.fromValues(
				coords[i * 3] / 25.4,
				coords[i * 3 + 1] / 25.4,
				coords[i * 3 + 2] / 25.4
			);

			projectedCoords[i] = {
				x: vec3.dot(projectionVecX, scaledCoords[i]),
				y: vec3.dot(projectionVecY, scaledCoords[i]),
			};
		}

		// Fill edges
		for (let i = 0; i < indices.length / 3; i++) {
			const i1 = indices[i * 3],
				i2 = indices[i * 3 + 1],
				i3 = indices[i * 3 + 2];

			addEdge(i1, i2);
			addEdge(i2, i3);
			addEdge(i3, i1);
		}

		// Create paths
		let hasOuterPath = false,
			polygonCoords = [] as typeof projectedCoords;

		for (let i = 0; i < vertexCount; i++) {
			const edgeStr = `${Math.min(i, i + 1)}-${Math.max(i, i + 1)}`;

			if (edgeStr in edges || i == 0) {
				polygonCoords[polygonCoords.length] = projectedCoords[i];
			} else {
				polygonCoords[polygonCoords.length] = projectedCoords[i];

				if (hasOuterPath) {
					myCanvas.shapes.push(new Polygon(polygonCoords, true));
				} else {
					myCanvas.shapes.push(new Polygon(polygonCoords));
					hasOuterPath = true;
				}

				polygonCoords = [];
			}
		}
	}

	clean() {
		// Delete shape
		const idx = myCanvas.shapes.findIndex((s) => s === this);
		if (idx >= 0) {
			myCanvas.shapes.splice(idx, 1);
		}

		// Delete all nodes
		this.points.forEach((point) => point.clean());
	}

	get area(): number {
		let area = 0;

		for (let idx = 0; idx < this.points.length - 1; idx++) {
			area +=
				this.points[idx].x() * this.points[idx + 1].y() -
				this.points[idx + 1].x() * this.points[idx].y();
		}

		return 0.5 * area;
	}
}
