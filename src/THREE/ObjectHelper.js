import * as THREE from 'three';
import { CSS2DObject } from './Extras/CSS2DRenderer';
import THREEHelper from './THREEHelper';
import Translation from '../Transformations/Translation';
import Scale from '../Transformations/Scale';
import Rotation from '../Transformations/Rotation';
import Shear from '../Transformations/Shear';

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
		let ground = new THREE.GridHelper(subdivision, subdivision)
		ground.size = subdivision;

		return ground;
	}

	// Our vector is composed of a line and a cone.
	static createVector = (direction, magnitude, color=0x000000, label) => {
		let vectorGeometry = new THREE.Geometry();
		let origin = new THREE.Vector3(0, 0, 0);
		let up = new THREE.Vector3(0, 1, 0);

		let destination = origin.clone().addScaledVector(up, magnitude);
		vectorGeometry.vertices.push(
			origin,
			destination
		);
		vectorGeometry.computeBoundingBox();

		let vectorObject = new THREE.Line(vectorGeometry, new THREE.LineBasicMaterial({
			color: color
		}));
		vectorObject.type = 'Vector';

		let arrowGeometry = new THREE.ConeGeometry(0.05, 0.05, 10);
		let arrow = new THREE.Mesh(arrowGeometry, new THREE.MeshBasicMaterial({
			color: color
		}));
		arrow.position.copy(destination);

		let rotationAxis;
		let rotationAngle;
		// This code section aligns the vector object to the direction.
		// If the vector we are trying to align to is exactly the opposite of our up vector
		if (direction.equals(new THREE.Vector3(0, -1, 0))) {
			// We just flip the vector upside down
			rotationAxis = new THREE.Vector3(1, 0, 0);
			rotationAngle = Math.PI;
		} else {
			/*
				Otherwise we do the following:
					Rotation axis = V1 x V2
					Rotation angle = arccos(V1 * V2)
					Rotate the vector with the previous values.
			*/
			rotationAxis = up.clone().cross(direction).normalize();
			rotationAngle = Math.acos(up.dot(direction));
		}

		let rotationMatrix = new THREE.Matrix4().makeRotationAxis(rotationAxis, rotationAngle);
		vectorObject.applyMatrix(rotationMatrix);

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
		triangleGeometry.computeFaceNormals();

		// This line is to set the center of the triangle at (0,0,0)
		triangleGeometry.translate(-(width/3), -(width/3), 0);
		return ObjectHelper.createObject(
			'Triangle',
			triangleGeometry,
			displayMode,
			color,
			outlineColor,
			label);
	}

	static createQuad = (width, heigth, displayMode, color, outlineColor, label) => {
		return ObjectHelper.createObject(
			'Quad',
			new THREE.PlaneGeometry(width, heigth),
			displayMode,
			color,
			outlineColor,
			label);
	}

	static createCube = (width, heigth, depth, displayMode, color, outlineColor, label) => {
		return ObjectHelper.createObject(
			'Cube',
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
	static createObject = (type, geometry, displayMode, color=0xffffff, outlineColor=0x000000, label) => {
		let object = ObjectHelper.createMesh(geometry, displayMode, color);
		object.type = type;
		object.matrixAutoUpdate = false;

		let objectOutlines = ObjectHelper.createOutlines(geometry, displayMode, outlineColor);
		object.outline = objectOutlines;
		object.add(objectOutlines);

		ObjectHelper.applyLabelOnObject(object, label);

		return object;
	}

	static addVecpadUtilities = (object, reactUpdateFunc) => {
		object.originalMatrix = object.matrix.clone();
		object.transformations = [];

		object.callback = () => {};

		object.registerCallback = (func) => object.callback = (changedObject) => func(changedObject)

		object.unregisterCallback = () => object.callback = () => {};

		object.applyTransformations = () => {
			object.matrix.copy(object.originalMatrix);
			let transMatrix = object.transformations.reduce((matrix, trans) =>
				matrix.multiply(trans.getMatrix()), new THREE.Matrix4()
			);
			object.applyMatrix(transMatrix);
			ObjectHelper.computeLabelPosition(object);
			object.callback(object);
			reactUpdateFunc();
		}

		object.addTransformation = (transformation) => {
			transformation.update = (step) => {
				transformation.currentStep = step;
				object.applyTransformations();
			}

			transformation.prioritize = () => {
				let currentIndex = object.transformations.indexOf(transformation);
				if (currentIndex !== 0) {
					object.swapTransformations(currentIndex, currentIndex - 1);
				}
			}

			transformation.deprioritize = () => {
				let currentIndex = object.transformations.indexOf(transformation);
				if (currentIndex !== object.transformations.length - 1) {
					object.swapTransformations(currentIndex, currentIndex + 1);
				}
			}

			object.transformations.push(transformation);
			object.applyTransformations();
		}

		object.addTranslation = (x, y, z) => object.addTransformation(new Translation(x, y, z));

		object.addScale = (x, y, z) => object.addTransformation(new Scale(x, y, z));

		object.addShear = (xy, xz, yx, yz, zx, zy) => object.addTransformation(new Shear(xy, xz, yx, yz, zx, zy));

		object.addRotation = (axis, angle) => object.addTransformation(new Rotation(axis, angle));

		object.removeTransformation = (transformation) => {
			object.transformations = object.transformations.filter((trans) => trans !== transformation);
			object.applyTransformations();
			reactUpdateFunc();
		}

		object.swapTransformations = (i, j) => {
			[object.transformations[i], object.transformations[j]] = [object.transformations[j], object.transformations[i]];
			object.applyTransformations();
		}

		object.select = () => {
			object.label.element.classList.add('selected');
			const selectedColor = 0xffa500;
			const selectedWidth = 2;

			if (object.type === 'Vector') {
				let {arrow, material} = object;
				object.originalColor = material.color.getHex();
				material.color.setHex(selectedColor);
				material.linewidth = selectedWidth;
				arrow.material.color.setHex(selectedColor);
				material.depthTest = false;
				arrow.material.depthTest = false;
			} else {
				let selection = new THREE.LineSegments(object.outline.geometry, new THREE.LineBasicMaterial({
					depthTest: false,
					color: selectedColor,
					linewidth: selectedWidth
				}));
				object.selection = selection;
				object.add(selection);
			}
		}

		object.deselect = () => {
			object.label.element.classList.remove('selected');
			const unselectedWidth = 1;

			if (object.type === 'Vector') {
				let { arrow, material, originalColor} = object;
				material.color.setHex(originalColor);
				material.linewidth = unselectedWidth;
				arrow.material.color.setHex(originalColor);
				material.depthTest = true;
				arrow.material.depthTest = true;
				delete object.originalColor;
			} else {
				object.remove(object.selection);
				delete object.selection;
			}
		}

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
		labelObject.matrixAutoUpdate = false;

		object.label = labelObject;
		object.add(labelObject);

		ObjectHelper.computeLabelPosition(object);
	}

	static computeLabelPosition = (object) => {
		/*
			To set the positions of the label, we set it at the highest point in the Y axis
			and the average of the X and Z axis.
		*/
		let worldPositions = object.geometry.vertices.map((vertex) => {
			return vertex.clone().applyMatrix4(object.matrix);
		});

		let average = vertices => vertices.reduce((sum, elem) => elem + sum, 0) / vertices.length;

		let x = average(worldPositions.map((elem) => elem.x));
		let y = Math.max(...worldPositions.map((elem) => elem.y)) + 0.25;
		let z = average(worldPositions.map((elem) => elem.z));

		let translationToPos = new THREE.Matrix4().makeTranslation(x, y, z);
		object.label.matrix.copy(new THREE.Matrix4());
		object.label.applyMatrix(new THREE.Matrix4().getInverse(object.matrix, false).multiply(translationToPos));
	}
}