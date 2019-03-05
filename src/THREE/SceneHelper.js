import * as THREE from 'three';
import ObjectHelper from './ObjectHelper';
import VecpadVector from './VecpadVector';
import VecpadMesh from './VecpadMesh';

// A wrapper around the scene in THREE.js
export default class SceneHelper {

	/*
		These represent the different display mode :
			- FILL will show the objects with a lambertian material without outline.
			- OUTLINE will show only the outline of the objects, meaning we can see through it.
			- BOTH is the combination of the two previous ones.
	*/
	static DisplayMode = {
		FILL: 0,
		OUTLINE: 1,
		BOTH: 2
	}

	static SELECTED_COLOR = 0xffa500;
	static SELECTED_LINEWIDTH = 2;
	static UNSELECTED_LINEWIDTH = 1;

	constructor(updateReact) {
		this.updateReact = updateReact;

		this.THREEScene = new THREE.Scene();
		this.selectedObject = null;

		// The information on the state of our application.
		this.currentDisplayMode = SceneHelper.DisplayMode.BOTH;

		// The different light sources are defined here.
		this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
		this.directionalLight.position.set(1, 1, 1).normalize();
		this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		this.hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5);

		// Information on the grid at Y=0 that act as a reference for our scene.
		let ground = ObjectHelper.createGround(2);
		this.THREEScene.ground = ground;
		this.addObjects(this.directionalLight, this.ambientLight, this.hemisphereLight, ground);
	}

	// This function add one or multiple objects to the scene.
	addObjects = (...object) => {
		this.THREEScene.add(...object);
	}

	// Inverse function of addObject.
	removeObject = (object) => {
		// We have to check if we deleted our selection!
		if (this.selectedObject && object.id === this.selectedObject.id) {
			this.selectedObject = null;
		}

		object.remove(object.label);
		this.THREEScene.remove(object);
		this.updateReact();
	}

	getVecpadObjectList = () => this.THREEScene.children.filter((object) =>
		!(
			object === this.THREEScene.ground ||
			object instanceof THREE.Light
		)
	);

	getVectors = () => this.getVecpadObjectList().filter((object) => object.type === 'Vector');

	// A function used to change the size of the grid at Y=0
	updateGround = (size) => {
		if (size === this.THREEScene.ground.size) {
			return;
		}
		this.THREEScene.remove(this.THREEScene.ground);
		let ground = ObjectHelper.createGround(size);
		ground.size = size;
		this.THREEScene.ground = ground;
		this.addObjects(ground);
		this.updateReact();
	};

	// This function changes the way an object is displayed
	applyDisplayMode = (mode) => {
		if (mode === this.currentDisplayMode) {
			return;
		}

		this.currentDisplayMode = mode;
		this.THREEScene.children.filter((object) =>
			// We don't change the ground, lights and vector objects.
			!(
				object === this.THREEScene.ground ||
				object instanceof THREE.Light ||
				object.type === 'Vector'
			)
		).forEach((object) => {

			// See SceneHelper's display mode for details.
			object.material.transparent = (this.currentDisplayMode === SceneHelper.DisplayMode.OUTLINE);
			object.outline.material.transparent = (this.currentDisplayMode === SceneHelper.DisplayMode.FILL);
		});
		this.updateReact();
	}

	// Function used to add object to the scene and to the object list.
	addVecpadObject = (origin, object) => {
		let translationToOrigin = new THREE.Matrix4().makeTranslation(origin.x, origin.y, origin.z);
		object.applyMatrix(translationToOrigin);

		this.addObjects(object);
		this.updateReact();
	}

	// These functions are used to add certain type of objects to the scene.

	addVector = (direction, color, label) => {
		let vector = new VecpadVector(direction, color, label, this.updateReact);
		this.addObjects(vector);
		this.updateReact();
	}

	addTriangle = (origin, sideWidth, color, outlineColor, label) => {
		let triangle = new VecpadMesh(
			ObjectHelper.createTriangleGeometry(sideWidth),
			'Triangle',
			this.currentDisplayMode,
			color,
			outlineColor,
			label,
			this.updateReact
		);
		this.addVecpadObject(origin, triangle);
	}

	addQuad = (origin, width, height, color, outlineColor, label) => {
		let quad = new VecpadMesh(
			new THREE.PlaneGeometry(width, height),
			'Quad',
			this.currentDisplayMode,
			color,
			outlineColor,
			label,
			this.updateReact
		);
		this.addVecpadObject(origin, quad);
	}

	addCube = (origin, width, height, depth, color, outlineColor, label) => {
		let cube = new VecpadMesh(
			new THREE.BoxGeometry(width, height, depth),
			'Quad',
			this.currentDisplayMode,
			color,
			outlineColor,
			label,
			this.updateReact
		);
		this.addVecpadObject(origin, cube);
	}

	addCrossProduct = (v1, v2, color, label=null) => {
		let newDirection = new THREE.Vector3().crossVectors(v1.vector, v2.vector);
		let origin = v1.geometry.vertices[0].clone().applyMatrix4(v1.matrixWorld);
		this.addVector(
			origin,
			newDirection.clone().normalize(),
			newDirection.length(),
			color,
			label || `${v1.name} X ${v2.name}`
		)
	}

	addVectorAddition = (v1, v2, color, label=null) => {
		let newVector = new THREE.Vector3().addVectors(v1.vector, v2.vector);
		let origin = v1.geometry.vertices[0].clone().applyMatrix4(v1.matrixWorld);
		this.addVector(
			origin,
			newVector.clone().normalize(),
			newVector.length(),
			color,
			label || `${v1.name} + ${v2.name}`
		)
	}

	addVectorSubtraction = (v1, v2, color, label=null) => {
		let newVector = new THREE.Vector3().subVectors(v1.vector, v2.vector);
		let origin = v1.geometry.vertices[0].clone().applyMatrix4(v1.matrixWorld);
		this.addVector(
			origin,
			newVector.clone().normalize(),
			newVector.length(),
			color,
			label || `${v1.name} - ${v2.name}`
		)
	}

	selectObject = (object) => {
		if (this.selectedObject) {
			this.selectedObject.deselect();
		}

		this.selectedObject = object;
		object.select();
		this.updateReact();
	};

	deselectObject = () => {
		this.selectedObject.deselect();
		this.selectedObject.unregisterCallback();
		this.selectedObject = null;
		this.updateReact();
	};
}