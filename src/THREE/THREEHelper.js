import RendererHelper from './RendererHelper';
import CameraHelper from './CameraHelper';
import SceneHelper from './SceneHelper';
import ObjectHelper from './ObjectHelper';
import * as THREE from 'three';

/*
	This is probably the most important object within Vecpad. It is a sort of
	wrapper for THREE.js, we also use it as a sort of state for the application.
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
		this.currentDisplayMode = THREEHelper.BOTH;
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
		THREE2DRendererDom.addEventListener('click', this.setSelection, false);

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

	// Our draw function.
	renderLoop = () => {
		requestAnimationFrame(this.renderLoop);
		this.rendererHelper.render(this.sceneHelper.THREEScene, this.cameraHelper.THREECamera);
	}

	// Set selection is used to check if the area where the user clicked contains an object, if so we select it.
	setSelection = (event) => {

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
		}
		this.updateReact();
	}

	// This function stores the object we collided with and displays it accordingly.
	applySelectionOnObject = (object) => {
		this.selectedObject = object;
		const selectedColor = 0xff0000;
		const selectedLineWidth = 2;

		// If we have a vector
		if (object instanceof THREE.Line) {

			// We apply our selection color to the line and the arrow of the vector regardless of the display mode.
			this.selectedObject.previousColor = object.material.color.getHex();
			object.material.color.setHex(selectedColor);
			object.arrow.material.color.setHex(selectedColor);
			object.material.linewidth = selectedLineWidth;
		} else if (this.currentDisplayMode === THREEHelper.FILL) {
			// If the display mode is FILL we apply the color to the lambertian material.
			this.selectedObject.previousColor = object.material.color.getHex();
			object.material.color.setHex(selectedColor);
		} else {
			// If the display mode is OUTLINE or BOTH we only change the color of the outline.
			this.selectedObject.previousColor = object.outline.material.color.getHex();
			object.outline.material.color.setHex(selectedColor);
			object.outline.material.linewidth = selectedLineWidth;
		}
	}

	// This function is the inverse of applySelectionOnObject
	deselectObject = () => {
		const previousColor = this.selectedObject.previousColor;
		const unselectedLineWidth = 1;
		if (this.selectedObject instanceof THREE.Line) {
			this.selectedObject.material.color.setHex(previousColor);
			this.selectedObject.arrow.material.color.setHex(previousColor);
			this.selectedObject.material.linewidth = unselectedLineWidth;
		} else if (this.currentDisplayMode === THREEHelper.FILL) {
			this.selectedObject.material.color.setHex(previousColor);
		} else {
			this.selectedObject.outline.material.color.setHex(previousColor);
			this.selectedObject.outline.material.linewidth = unselectedLineWidth;
		}
	}

	// Function used to add object to the scene and to the object list.
	addObject = (object) => {
		this.objectList.push({
			id: object.id,
			name: object.name,
			vertices: object.geometry.vertices
		});
		this.sceneHelper.addObject(object);
		this.updateReact();
	}

	// Inverse function of addObject.
	removeObject = (id) => {
		this.objectList = this.objectList.filter((object) => object.id !== id);
		this.sceneHelper.removeObject(id);
		this.updateReact();
	}

	// These functions are used to add certain type of objects to the scene.

	addVector = (direction, origin, magnitude, color, label) => {
		let vector = ObjectHelper.createVector(
			direction,
			origin,
			magnitude,
			color,
			label
		);
		this.addObject(vector);
	}

	addTriangle = (sideWidth, color, outlineColor, label) => {
		let triangle = ObjectHelper.createTriangle(
			sideWidth,
			this.currentDisplayMode,
			color,
			outlineColor,
			label);
		this.addObject(triangle);
	}

	addQuad = (width, height, color, outlineColor, label) => {
		let quad = ObjectHelper.createQuad(
			width,
			height,
			this.currentDisplayMode,
			color,
			outlineColor,
			label);
		this.addObject(quad);
	}

	addCube = (width, height, depth, color, outlineColor, label) => {
		let cube = ObjectHelper.createCube(
			width,
			height,
			depth,
			this.currentDisplayMode,
			color,
			outlineColor,
			label);
		this.addObject(cube);
	}

	// A function used to change the size of the grid at Y=0
	updateGround = (size) => {
		if (size === this.groundSize) {
			return;
		}

		this.sceneHelper.removeObject(this.ground.id);
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

		// If we have a selected object we need to update the way the selection appears.
		if (this.selectedObject) {
			this.deselectObject();
			this.currentDisplayMode = mode;
			this.applySelectionOnObject(this.selectedObject);
		} else {
			this.currentDisplayMode = mode;
		}

		// We then need to update the objects.
		this.sceneHelper.applyDisplayMode(this.currentDisplayMode, this.ground);
		this.updateReact();
	}
}