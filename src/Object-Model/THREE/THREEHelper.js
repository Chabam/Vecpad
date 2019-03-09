import RendererHelper from './RendererHelper';
import CameraHelper from './CameraHelper';
import SceneHelper from './SceneHelper';
import * as THREE from 'three';

/*
	This is probably the most important object within Vecpad. It is a sort of
	wrapper for THREE.js, we also use it as a "state" for the application.
*/
export default class THREEHelper {

	constructor(reactUpdateFunc) {
		// IMPORTANT!
		// This function is used to tell React to update its state, be sure to use it everytime THREEHelper
		// (or another helpers) changes!
		this.updateReact = () => reactUpdateFunc(this);

		this.rendererHelper = new RendererHelper();
		this.cameraHelper = new CameraHelper();
		this.sceneHelper = new SceneHelper(this.updateReact);

		// The raycaster is used to select objects using rays.
		this.rayCaster = new THREE.Raycaster();
		this.rayCaster.linePrecision = 0.05;
		this.rayCaster.near = 0.1;

		// These will help us to keep information about the DOM, especially to maintain correctly our canvas.
		this.container = null;
		this.height = 0;
		this.width = 0;
	}

	// The function used to create our THREE.js context with all the required elements.
	init = () => {
		this.container = document.getElementById('visualizer-container');
		this.setDimensions();

		let { THREE3DRendererDom, THREE2DRendererDom } = this.rendererHelper.init(this.width, this.height);
		this.cameraHelper.init(this.width / this.height, THREE2DRendererDom);

		this.container.appendChild(THREE3DRendererDom);
		this.container.appendChild(THREE2DRendererDom);

		// The events we are registered to.
		window.addEventListener('resize', this.setDimensions);
		THREE2DRendererDom.addEventListener('click', this.setSelectionFromMouse, false);

		this.renderLoop();
	}

	// Since our window is dynamically sized, we need to update the size and aspect ratio of the canvas.
	setDimensions = (event) => {
		let timeline = document.getElementById('timeline');
		let width = this.container.offsetWidth;
		let height = this.container.offsetHeight - (timeline ? timeline.offsetHeight : 0);

		// Our sizes are defined by these calculations.
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
	setSelectionFromMouse = (event) => {
		// First we need to find out where our mouse is in the coordinates of the camera.
		let mouseNormalizedCoords = new THREE.Vector2();
		mouseNormalizedCoords.x = (event.clientX / this.width) * 2 - 1;
		mouseNormalizedCoords.y = -(event.clientY / this.height) * 2 + 1;

		// Then we trace a ray to check wether or not we have a collision.
		this.rayCaster.setFromCamera(mouseNormalizedCoords, this.cameraHelper.THREECamera);
		let intersects = this.rayCaster.intersectObjects(
			// We exclude the graph since there is no use to select it.
			this.sceneHelper.getVecpadObjectList()
		);

		let { selectedObject } = this.sceneHelper;
		// If we have a collision.
		if (intersects.length > 0) {
			let [closestIntersection] = intersects;
			let object = closestIntersection.object;

			// If the collision is not the same object we already selected.
			if (selectedObject !== object) {

				// If we previously selected an object we deselect it.
				if (selectedObject) {
					this.sceneHelper.deselectObject();
				}

				// Then we select the object.
				this.sceneHelper.selectObject(object);
			}
		} else if (selectedObject) {
			// If we have no collision and a previously selected object we deselect it.
			this.sceneHelper.deselectObject();
		}
	}

	static displayFloat = (number) => number % 1 === 0 ? number : number.toFixed(2);
}