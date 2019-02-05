import * as THREE from 'three';
import { CSS2DObject } from './Extras/CSS2DRenderer';
import THREEHelper from './THREEHelper';

export default class ObjectHelper {

	static createGround = (subdivision) => {
		if (subdivision % 2 === 1) {
			console.warn(`The ground has to be divisible by two, you provided ${subdivision}. It will be changed to ${subdivision + 1}.`)
			subdivision = subdivision + 1;
		}

		return new THREE.GridHelper(subdivision, subdivision);
	}

	static createVector = (direction, origin, magnitude, color=0x000000, label) => {
		let vectorObject = new THREE.ArrowHelper(direction, origin, magnitude, color);

		vectorObject.userData = {
			vertices: [origin, origin.clone().addScalar(magnitude)],
			origin: origin,
			magnitude: magnitude
		};

		ObjectHelper.applyLabelOnObject(vectorObject, label);

		return vectorObject;
	}

	static createTriangle = (width, displayMode, color, outlineColor, label) => {
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

	static createQuad = (width, heigth, displayMode, color, outlineColor, label) => {
		return ObjectHelper.createObject(
			new THREE.PlaneGeometry(width, heigth),
			displayMode,
			color,
			outlineColor,
			label);
	}

	static createCube = (width, heigth, depth, displayMode, color, outlineColor, label) => {
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

	static createObject = (geometry, displayMode, color=0xffffff, outlineColor=0x000000, label) => {
		let object = ObjectHelper.createMesh(geometry, displayMode, color);

		let objectOutlines = ObjectHelper.createOutlines(geometry, displayMode, outlineColor);
		objectOutlines.name = 'outline';
		object.add(objectOutlines);

		ObjectHelper.applyLabelOnObject(object, label);

		return object;
	}

	static applyLabelOnObject = (object, text) => {
		object.name = text || `Object #${object.id}`;
		let vertices = object instanceof THREE.ArrowHelper ?
			object.userData.vertices :
			object.geometry.vertices;
		let labelObject = ObjectHelper.createLabel(object.name);
		let average = vertices => vertices.reduce((sum, elem) => elem + sum, 0) / vertices.length
		let x = object instanceof THREE.ArrowHelper ? 0 : average(vertices.map((elem) => elem.x));
		let z = object instanceof THREE.ArrowHelper ? 0 : average(vertices.map((elem) => elem.z));
		let y = Math.max(...vertices.map((elem) => elem.y)) + 0.25;
		labelObject.position.set(x, y, z);
		labelObject.name = 'label';
		object.add(labelObject);
	}

	static createLabel = (text) => {
		let objectDiv = document.createElement('div');
		objectDiv.className = 'object-label';
		objectDiv.textContent = text;
		return new CSS2DObject(objectDiv);
	}

}