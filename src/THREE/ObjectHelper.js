import * as THREE from 'three';
import { CSS2DObject } from './Extras/CSS2DRenderer';
import THREEHelper from './THREEHelper';

export default class ObjectHelper {

	static createGround = (subdivision) => {
		if (subdivision % 2 === 1) {
			console.warn(`The ground has to be divisible by two, you provided ${subdivision}. It will be changed to ${subdivision + 1}.`)
			subdivision = subdivision + 1;
		}
		let maxCoord = subdivision/2;
		let minCoord = -maxCoord;

		let topLeft     = new THREE.Vector3(minCoord, 0, minCoord);
		let topRight    = new THREE.Vector3(maxCoord, 0, minCoord);
		let bottomLeft  = new THREE.Vector3(minCoord, 0, maxCoord);
		let bottomRight = new THREE.Vector3(maxCoord, 0, maxCoord);

		let lines = new THREE.Geometry();
		lines.vertices.push(
			topLeft, topRight,
			topRight, bottomRight,
			bottomRight, bottomLeft,
			bottomLeft, topLeft
		);

		for (let i = 1; i < subdivision; i++) {
			let currentValue = minCoord + i;
			let currentXCoord = new THREE.Vector3(currentValue, 0, minCoord);
			let currentZCoord = new THREE.Vector3(minCoord, 0, currentValue);
			let destXCoord    = new THREE.Vector3(currentValue, 0, maxCoord);
			let destZCoord    = new THREE.Vector3(maxCoord, 0, currentValue);
			lines.vertices.push(
				currentXCoord, destXCoord,
				currentZCoord, destZCoord
			);
		}

		let ground = new THREE.LineSegments(lines, new THREE.LineBasicMaterial({
			color: 0x555555
		}));

		let subLines = new THREE.Geometry();
		for (let i = 1; i < subdivision * 4; i++) {
			let currentValue = minCoord + (i / 4);

			if (Number.isInteger(currentValue)) {
				continue;
			}

			let currentXCoord = new THREE.Vector3(currentValue, 0, minCoord);
			let currentZCoord = new THREE.Vector3(minCoord, 0, currentValue);
			let destXCoord    = new THREE.Vector3(currentValue, 0, maxCoord);
			let destZCoord    = new THREE.Vector3(maxCoord, 0, currentValue);
			subLines.vertices.push(
				currentXCoord, destXCoord,
				currentZCoord, destZCoord
			);
		}

		let subdividedGround = new THREE.LineSegments(subLines, new THREE.LineBasicMaterial({
			color: 0xcccccc
		}));

		ground.add(subdividedGround);

		return ground;
	}

	static createTriangle = (width, displayMode, color, outlineColor, label='Triangle #') => {
		let p1 = new THREE.Vector3(0, 0, 0);
		let p2 = new THREE.Vector3(width, 0, 0);
		let p3 = new THREE.Vector3(0, width, 0);
		let triangleGeometry = new THREE.Geometry();
		triangleGeometry.vertices.push(p1, p2, p3);
		triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
		triangleGeometry.computeBoundingSphere();
		triangleGeometry.computeFaceNormals();
		triangleGeometry.translate(-(width/3), -(width/3), 0);
		return ObjectHelper.createObject(triangleGeometry, displayMode, color, outlineColor, label);
	}

	static createQuad = (width, heigth, displayMode, color, outlineColor, label='Quad #') => {
		return ObjectHelper.createObject(
			new THREE.PlaneGeometry(width, heigth),
			displayMode,
			color,
			outlineColor,
			label);
	}

	static createCube = (width, heigth, depth, displayMode, color, outlineColor, label='Cube #') => {
		return ObjectHelper.createObject(
			new THREE.BoxGeometry(width, heigth, depth),
			displayMode,
			color,
			outlineColor,
			label);
	}

	static createMesh = (geometry, displayMode, color) => {
		return new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
			color: color,
			side: THREE.DoubleSide,
			opacity: 0,
			transparent: (displayMode === THREEHelper.OUTLINE)
		}));
	}

	static createOutlines = (geometry, displayMode, color) => {
		let egdes = new THREE.EdgesGeometry(geometry);
		return new THREE.LineSegments(egdes, new THREE.LineBasicMaterial({
			color: color,
			opacity: 0,
			transparent: (displayMode === THREEHelper.FILL)
		}));
	}

	static createObject = (geometry, displayMode, color=0xffffff, outlineColor=0x000000, label='') => {
		let object = ObjectHelper.createMesh(geometry, displayMode, color);

		let objectOutlines = ObjectHelper.createOutlines(geometry, displayMode, outlineColor);
		objectOutlines.name = 'outline';
		object.name = label.concat(` ${object.id}`);
		object.add(objectOutlines);

		let labelObect = ObjectHelper.createLabel(object.name);
		let average = vertices => vertices.reduce((sum, elem) => elem + sum, 0) / vertices.length
		let averageX = average(geometry.vertices.map((elem) => elem.x));
		let averageZ = average(geometry.vertices.map((elem) => elem.z));
		let highestY = Math.max(...geometry.vertices.map((elem) => elem.y)) + 0.25;
		labelObect.position.set(averageX, highestY, averageZ);
		labelObect.name = 'label';
		object.add(labelObect);

		return object;
	}

	static createLabel = (text) => {
		let objectDiv = document.createElement('div');
		objectDiv.className = 'object-label';
		objectDiv.textContent = text;
		return new CSS2DObject(objectDiv);
	}

}