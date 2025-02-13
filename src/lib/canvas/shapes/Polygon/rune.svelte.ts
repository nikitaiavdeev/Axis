import { myCanvas } from "$lib/runes/canvas.svelte";
import { Point } from "../../point/rune.svelte";
import { vec3 } from "gl-matrix";

export class Polygon {
	isHole = $state(false);
	pointCoords = $state([] as { x: number; y: number }[]);
	points = $state([]) as Point[];

	constructor(pointCoords: { x: number; y: number }[], isHole = false) {
		this.pointCoords = pointCoords;

		for (let idx = 0; idx < pointCoords.length; idx++) {
			this.appendPoint(idx);
		}

		this.isHole = isHole;
	}

	appendPoint(idx: number) {
		this.points[idx] = new Point(
			() => this.pointCoords[idx].x,
			() => this.pointCoords[idx].y,
			this
		);
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

		vec3.normalize(projectionVecX, projectionVecX);
		vec3.normalize(projectionVecY, projectionVecY);

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

	properties = $derived.by(() => {
		const properties = {
				area: 0,
				cX: 0,
				cY: 0,
				iX: 0,
				iY: 0,
				iXY: 0,
			},
			pCoords = this.pointCoords;

		for (let idx = 0; idx < pCoords.length; idx++) {
			const idxP1 = idx == pCoords.length - 1 ? 0 : idx + 1,
				ithArea = pCoords[idx].x * pCoords[idxP1].y - pCoords[idxP1].x * pCoords[idx].y;

			properties.area += ithArea;
			properties.cX += ithArea * (pCoords[idx].x + pCoords[idxP1].x);
			properties.cY += ithArea * (pCoords[idx].y + pCoords[idxP1].y);

			properties.iX +=
				ithArea * (pCoords[idx].y ** 2 + pCoords[idx].y * pCoords[idxP1].y + pCoords[idxP1].y ** 2);
			properties.iY +=
				ithArea * (pCoords[idx].x ** 2 + pCoords[idx].x * pCoords[idxP1].x + pCoords[idxP1].x ** 2);
			properties.iXY +=
				ithArea *
				(pCoords[idx].x * pCoords[idxP1].y +
					2 * pCoords[idx].x * pCoords[idx].y +
					2 * pCoords[idxP1].x * pCoords[idxP1].y +
					pCoords[idxP1].x * pCoords[idx].y);
		}

		properties.area *= 0.5;
		properties.cX /= 6 * properties.area;
		properties.cY /= 6 * properties.area;
		properties.iX = properties.iX / 12 - properties.area * properties.cY ** 2;
		properties.iY = properties.iY / 12 - properties.area * properties.cX ** 2;
		properties.iXY = properties.iXY / 24 - properties.area * properties.cX * properties.cY;

		return properties;
	});
}
