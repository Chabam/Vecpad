import RendererHelper from './RendererHelper';
import CameraHelper from './CameraHelper';
import SceneHelper from './SceneHelper';
import ObjectHelper from './ObjectHelper';
import * as THREE from 'three';

/*
	This is probably the most important object within Vecpad. It is a sort of
	wrapper for THREE.js, we also use it as a "state" for the application.
*/
export default class THREEHelper {

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

	constructor(reactUpdateFunc) {
		this.rendererHelper = new RendererHelper();
		this.cameraHelper = new CameraHelper();
		this.sceneHelper = new SceneHelper();

		// IMPORTANT!
		// This function is used to tell React to update its state, be sure to use it everytime THREEHelper changes!
		this.updateReact = () => reactUpdateFunc(this);

		// The raycaster is used to select objects using rays.
		this.rayCaster = new THREE.Raycaster();
		this.rayCaster.linePrecision = 0.05;

		// These will help us to keep information about the DOM, especially to maintain correctly our canvas.
		this.toolbarElement = null;
		this.sidebarElement = null;
		this.height = 0;
		this.width = 0;

		// Information on the grid at Y=0 that act as a reference for our scene.
		this.groundSize = 2;
		this.ground = ObjectHelper.createGround(this.groundSize);
		this.sceneHelper.addObject(this.ground);

		// The information on the state of our application.
		this.currentDisplayMode = THREEHelper.DisplayMode.BOTH;
		this.objectList = [];
		this.selectedObject = null;
	}

	// The function used to create our THREE.js context with all the required elements.
	init = () => {
		this.toolbarElement = document.getElementById('toolbar');
		this.sidebarElement = document.getElementById('sidebar');
		this.setDimensions();

		let {THREE3DRendererDom, THREE2DRendererDom} = this.rendererHelper.init(this.width, this.height);
		this.cameraHelper.init(this.width / this.height, THREE2DRendererDom);

		document.getElementById('visualizer').appendChild(THREE3DRendererDom);
		document.getElementById('visualizer').appendChild(THREE2DRendererDom);

		// The events we are registered to.
		window.addEventListener('resize', this.setDimensions);
		THREE2DRendererDom.addEventListener('click', this.setSelectionFromMouse, false);
		this.renderLoop();
	}

	// Since our window is dynamically sized, we need to update the size and aspect ratio of the canvas.
	setDimensions = (event) => {
		let sidebarWidth = this.sidebarElement.offsetWidth;
		let toolbarHeight = this.toolbarElement.offsetHeight;
		let windowWidth = window.innerWidth;
		let windowHeight = window.innerHeight;

		// Our sizes are defined by these calculations.
		let width = windowWidth - sidebarWidth;
		let height = windowHeight - toolbarHeight;
		if (this.width !== width || this.height !== height) {
			this.height = height;
			this.width = width;

			// Event will exist only when called from an event.
			if (event) {
				this.cameraHelper.setAspectRatio(this.width / this.height);
				this.rendererHelper.setSize(this.width, this.height);
			}
		}
	}

	resetCamera = () => this.cameraHelper.reset();

	focusOnObjectID = (id) => this.focusOnObject(this.getObjectById(id));

	focusOnObject = (object) => this.cameraHelper.focusOnCoords(object.position);

	// Our draw function.
	renderLoop = () => {
		requestAnimationFrame(this.renderLoop);
		this.rendererHelper.render(this.sceneHelper.THREEScene, this.cameraHelper.THREECamera);
	}

	// Set selection is used to check if the area where the user clicked contains an object, if so we select it.
	setSelectionFromMouse = (event) => {

		// First we need to find out where our mouse is in the coordinates of the camera.
		let mouseNormalizedCoords = new THREE.Vector2();
		mouseNormalizedCoords.x = (event.clientX / this.width) * 2 - 1;
		mouseNormalizedCoords.y = -((event.clientY - this.toolbarElement.offsetHeight) / this.height) * 2 + 1;

		// Then we trace a ray to check wether or not we have a collision.
		this.rayCaster.setFromCamera(mouseNormalizedCoords, this.cameraHelper.THREECamera);
		let intersects = this.rayCaster.intersectObjects(
			// We exclude the ground since there is no use to select it.
			this.sceneHelper.THREEScene.children.filter((object) => object !== this.ground)
		);

		// If we have a collision.
		if (intersects.length > 0) {
			let [closestIntersection] = intersects;
			let object = closestIntersection.object;

			// If the collision is not the same object we already selected.
			if (this.selectedObject !== object) {

				// If we previously selected an object we deselect it.
				if (this.selectedObject) {
					this.deselectObject();
				}

				// Then we select the object.
				this.applySelectionOnObject(object);
			}
		} else if (this.selectedObject) {
			// If we have no collision and a previously selected object we deselect it.
			this.deselectObject();
			this.selectedObject = null;
			this.updateReact();
		}
	}

	applySelectionOnID = (id) => {
		if (this.selectedObject) {
			this.deselectObject();
			this.selectedObject = null;
		}

		this.applySelectionOnObject(this.getObjectById(id));
	};

	// This function stores the object we collided with and displays it accordingly.
	applySelectionOnObject = (object) => {
		this.selectedObject = object;
		this.selectedObject.label.element.classList.add('selected');
		const selectedColor = 0xffa500;
		const selectedWidth = 2;

		if (object.type === 'Vector') {
			let {arrow, material} = this.selectedObject;
			this.selectedObject.previousColor = material.color.getHex();
			material.color.setHex(selectedColor);
			material.linewidth = selectedWidth;
			arrow.material.color.setHex(selectedColor);
			material.depthTest = false;
			arrow.material.depthTest = false;
		} else {
			let selection = new THREE.LineSegments(this.selectedObject.outline.geometry, new THREE.LineBasicMaterial({
				depthTest: false,
				color: selectedColor,
				linewidth: selectedWidth
			}));
			this.selectedObject.selection = selection;
			this.selectedObject.add(selection);
		}
		this.updateReact();
	}

	// This function is the inverse of applySelectionOnObject
	deselectObject = () => {
		this.selectedObject.label.element.classList.remove('selected');
		const unselectedWidth = 1;

		if (this.selectedObject.type === 'Vector') {
			let {arrow, material, previousColor} = this.selectedObject;
			material.color.setHex(previousColor);
			material.linewidth = unselectedWidth;
			arrow.material.color.setHex(previousColor);
			material.depthTest = true;
			arrow.material.depthTest = true;
		} else {
			this.selectedObject.remove(this.selectedObject.selection);
			this.selectedObject.selection = null;
		}
	}

	// Function used to add object to the scene and to the object list.
	addObject = (origin, object) => {
		let {id, type, name} = object;
		object.position.copy(origin);
		this.objectList.push({
			id,
			type,
			name
		});
		this.sceneHelper.addObject(object);
		this.updateReact();
	}

	removeObjectById = (id) => this.removeObject(this.getObjectById(id));

	// Inverse function of addObject.
	removeObject = (object) => {
		this.objectList = this.objectList.filter((currObject) => currObject.id !== object.id);

		// We have to check if we deleted our selection!
		if (this.selectedObject && object.id === this.selectedObject.id) {
			this.selectedObject = null;
		}

		this.sceneHelper.removeObject(object);
		this.updateReact();
	}

	// These functions are used to add certain type of objects to the scene.

	addVector = (origin, direction, magnitude, color, label) => {
		let vector = ObjectHelper.createVector(
			direction,
			magnitude,
			color,
			label
		);
		this.addObject(origin, vector);
	}

	addTriangle = (origin, sideWidth, color, outlineColor, label) => {
		let triangle = ObjectHelper.createTriangle(
			sideWidth,
			this.currentDisplayMode,
			color,
			outlineColor,
			label);
		this.addObject(origin, triangle);
	}

	addQuad = (origin, width, height, color, outlineColor, label) => {
		let quad = ObjectHelper.createQuad(
			width,
			height,
			this.currentDisplayMode,
			color,
			outlineColor,
			label);
		this.addObject(origin, quad);
	}

	addCube = (origin, width, height, depth, color, outlineColor, label) => {
		let cube = ObjectHelper.createCube(
			width,
			height,
			depth,
			this.currentDisplayMode,
			color,
			outlineColor,
			label);
		this.addObject(origin, cube);
	}

	// A function used to change the size of the grid at Y=0
	updateGround = (size) => {
		if (size === this.groundSize) {
			return;
		}

		this.sceneHelper.removeObject(this.ground);
		this.groundSize = size;
		this.ground = ObjectHelper.createGround(this.groundSize);
		this.sceneHelper.addObject(this.ground);
		this.updateReact();
	};

	// This function update the way the object are rendred according the display mode.
	setDisplayMode = (mode) => {
		if (mode === this.currentDisplayMode) {
			return;
		}

		this.currentDisplayMode = mode;

		// We then need to update the objects.
		this.sceneHelper.applyDisplayMode(this.currentDisplayMode, this.ground);
		this.updateReact();
	}

	getObjectById = (id) => this.sceneHelper.getObjectById(id);
}