import * as THREE from 'three';
import ObjectHelper from './ObjectHelper';
import VecpadVector from '../VecpadVector';
import VecpadMesh from '../VecpadMesh';

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

	static SELECTED_COLOR = 0x009fe3;
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
		let graph = ObjectHelper.createGraph(2);
		this.THREEScene.graph = graph;
		this.addObjects(this.directionalLight, this.ambientLight, this.hemisphereLight, graph);
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

		object.clean();

		this.THREEScene.remove(object);
		this.updateReact();
	}

	getVecpadObjectList = () => this.THREEScene.children.filter((object) =>
		!(
			object === this.THREEScene.graph ||
			object instanceof THREE.Light
		)
	);

	getVectors = () => this.getVecpadObjectList().filter((object) => object.type === 'Vector');

	// A function used to change the size of the grid at Y=0
	updateGraph = (size) => {
		if (size === this.THREEScene.graph.size) {
			return;
		}
		this.THREEScene.graph.remove(
			this.THREEScene.graph.xLabel,
			this.THREEScene.graph.xMinusLabel,
			this.THREEScene.graph.yLabel,
			this.THREEScene.graph.yMinusLabel,
			this.THREEScene.graph.zLabel,
			this.THREEScene.graph.zMinusLabel
		)
		this.THREEScene.remove(this.THREEScene.graph);
		let graph = ObjectHelper.createGraph(size);
		graph.size = size;
		this.THREEScene.graph = graph;
		this.addObjects(graph);
		this.updateReact();
	};

	// This function changes the way an object is displayed
	applyDisplayMode = (mode) => {
		if (mode === this.currentDisplayMode) {
			return;
		}

		this.currentDisplayMode = mode;
		this.THREEScene.children.filter((object) =>
			// We don't change the graph, lights and vector objects.
			!(
				object === this.THREEScene.graph ||
				object instanceof THREE.Light ||
				object.type === 'Vector'
			)
		).forEach((object) => {

			// See SceneHelper's display mode for details.
			object.material.visible = (this.currentDisplayMode !== SceneHelper.DisplayMode.OUTLINE);
			object.outline.material.visible = (this.currentDisplayMode !== SceneHelper.DisplayMode.FILL);
		});
		this.updateReact();
	}

	// Function used to add object to the scene and to the object list.
	addVecpadObject = (object) => {
		this.addObjects(object);
		this.updateReact();
	}

	// These functions are used to add certain type of objects to the scene.

	addVector = () => {
		let vector = new VecpadVector(new THREE.Vector3(1, 1, 1), 0x000000, null, this.updateReact);
		this.addVecpadObject(vector);
	}

	addTriangle = () => {
		let triangle = new VecpadMesh(
			ObjectHelper.createTriangleGeometry(1),
			'Triangle',
			this.currentDisplayMode,
			0xffffff,
			0x000000,
			null,
			this.updateReact
		);
		this.addVecpadObject(triangle);
	}

	addQuad = () => {
		let quad = new VecpadMesh(
			new THREE.PlaneGeometry(1, 1),
			'Quad',
			this.currentDisplayMode,
			0xffffff,
			0x000000,
			null,
			this.updateReact
		);
		this.addVecpadObject(quad);
	}

	addCube = () => {
		let cube = new VecpadMesh(
			new THREE.BoxGeometry(1, 1, 1),
			'Cube',
			this.currentDisplayMode,
			0xffffff,
			0x000000,
			null,
			this.updateReact
		);
		this.addVecpadObject(cube);
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