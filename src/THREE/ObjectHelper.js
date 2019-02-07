import * as THREE from 'three';
import { CSS2DObject } from './Extras/CSS2DRenderer';
import THREEHelper from './THREEHelper';

/*
	This object is used to create different type of objects. All the functions are static
	and have no side effects.
*/
export default class ObjectHelper {

	static createGround = (subdivision) => {
		/*
			The reason we need to have a size divisible by two is because we want the center of the grid
			to be at (0,0,0).
		*/
		if (subdivision % 2 === 1) {
			console.warn(`The ground has to be divisible by two, you provided ${subdivision}. It will be changed to ${subdivision + 1}.`)
			subdivision = subdivision + 1;
		}

		return new THREE.GridHelper(subdivision, subdivision);
	}

	// Our vector is composed of a line and a cone.
	static createVector = (direction, origin, magnitude, color=0x000000, label) => {
		let vectorGeometry = new THREE.Geometry();
		let destination = origin.clone().addScaledVector(direction, magnitude);
		vectorGeometry.vertices.push(
			origin,
			destination
		);
		let vectorObject = new THREE.Line(vectorGeometry, new THREE.LineBasicMaterial({
			color: color
		}));

		let arrowGeometry = new THREE.ConeGeometry(0.02, 0.04, 3);
		let arrow = new THREE.Mesh(arrowGeometry, new THREE.MeshBasicMaterial({
			color: color
		}));

		// This code section aligns the tip of the arrow towards the vector direction.
		arrow.position.set(destination.x, destination.y, destination.z);
		let axis = new THREE.Vector3();
		axis.set( direction.z, 0, -direction.x ).normalize();
		let radians = Math.acos( direction.y );
		arrow.quaternion.setFromAxisAngle( axis, radians );
		vectorObject.arrow = arrow;
		vectorObject.add(arrow);

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

		// This line is to set the center of the triangle at (0,0,0)
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

	// A function used to create a TREE mesh object (essentially an object)
	static createMesh = (geometry, displayMode, color) => {
		return new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
			color: color,
			side: THREE.DoubleSide,
			opacity: 0,
			transparent: (displayMode === THREEHelper.OUTLINE)
		}));
	}

	// A function used to create an outline on the edges of the objects.
	static createOutlines = (geometry, displayMode, color) => {
		let egdes = new THREE.EdgesGeometry(geometry);
		return new THREE.LineSegments(egdes, new THREE.LineBasicMaterial({
			color: color,
			opacity: 0,
			transparent: (displayMode === THREEHelper.FILL)
		}));
	}

	/*
		This function is called almost on all objects we create. It creates the mesh, the outlines and
		a label on top of the object.
	*/
	static createObject = (geometry, displayMode, color=0xffffff, outlineColor=0x000000, label) => {
		let object = ObjectHelper.createMesh(geometry, displayMode, color);

		let objectOutlines = ObjectHelper.createOutlines(geometry, displayMode, outlineColor);
		object.outline = objectOutlines;
		object.add(objectOutlines);

		ObjectHelper.applyLabelOnObject(object, label);

		return object;
	}

	// This function create a CSS2DObject containing the text we want.
	static createLabel = (text) => {
		let objectDiv = document.createElement('div');
		objectDiv.className = 'object-label';
		objectDiv.textContent = text;
		return new CSS2DObject(objectDiv);
	}

	// This function attach the label on an object.
	static applyLabelOnObject = (object, text) => {

		// The default name when the text is empty is "Object" post-fixed with it's ID.
		object.name = text || `Object #${object.id}`;
		let labelObject = ObjectHelper.createLabel(object.name);

		/*
			To set the positions of the label, we set it at the highest point in the Y axis
			and the average of the X and Z axis.
		*/
		let vertices = object.geometry.vertices;
		let average = vertices => vertices.reduce((sum, elem) => elem + sum, 0) / vertices.length
		let x = average(vertices.map((elem) => elem.x));
		let z = average(vertices.map((elem) => elem.z));
		let y = Math.max(...vertices.map((elem) => elem.y)) + 0.25;
		labelObject.position.set(x, y, z);

		object.label = labelObject;
		object.add(labelObject);
	}
}