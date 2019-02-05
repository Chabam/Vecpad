import RendererHelper from './RendererHelper';
import CameraHelper from './CameraHelper';
import SceneHelper from './SceneHelper';
import ObjectHelper from './ObjectHelper';
import * as THREE from 'three';

export default class THREEHelper {

	static FILL = 1;
	static OUTLINE = 2;
	static BOTH = 3;

	constructor() {
		this.rendererHelper = new RendererHelper();
		this.cameraHelper = new CameraHelper();
		this.sceneHelper = new SceneHelper();

		this.toolbarElement = null;
		this.sidebarElement = null;
		this.height = 0;
		this.width = 0;

		this.groundSize = 2;
		this.ground = ObjectHelper.createGround(this.groundSize);
		this.sceneHelper.addObject(this.ground);

		this.currentDisplayMode = THREEHelper.BOTH;
		this.objectList = [];
		this.rayCaster = new THREE.Raycaster();
		this.mouseNormalizedCoords = new THREE.Vector2();
		this.selectedObject = null;
	}

	init = () => {
		this.toolbarElement = document.getElementById('toolbar');
		this.sidebarElement = document.getElementById('sidebar');
		this.setDimensions();

		let {THREE3DRendererDom, THREE2DRendererDom} = this.rendererHelper.init(this.width, this.height);
		this.cameraHelper.init(this.width / this.height, THREE2DRendererDom);

		document.getElementById('visualizer').appendChild(THREE3DRendererDom);
		document.getElementById('visualizer').appendChild(THREE2DRendererDom);

		window.addEventListener('resize', () => this.setDimensions(true));
		THREE2DRendererDom.addEventListener('mousemove', this.updateMouseNormalizedCoords, false);
		THREE2DRendererDom.addEventListener('click', this.setSelection, false);

		this.renderLoop();
	}

	setDimensions = (update=false) => {
		let sidebarWidth = this.sidebarElement.offsetWidth;
		let toolbarHeight = this.toolbarElement.offsetHeight;
		let windowWidth = window.innerWidth;
		let windowHeight = window.innerHeight;
		let width = windowWidth - sidebarWidth;
		let height = windowHeight - toolbarHeight;
		if (this.width !== width || this.height !== height) {
			this.height = height;
			this.width = width;
			if (update) {
				this.cameraHelper.setAspectRatio(this.width / this.height);
				this.rendererHelper.setSize(this.width, this.height);
			}
		}
	}

	updateMouseNormalizedCoords = (event) => {
		this.mouseNormalizedCoords.x = (event.clientX / this.width) * 2 - 1;
		this.mouseNormalizedCoords.y = -((event.clientY - this.toolbarElement.offsetHeight) / this.height) * 2 + 1;
	}

	setSelection = () => {
		this.rayCaster.setFromCamera(this.mouseNormalizedCoords, this.cameraHelper.THREECamera);
		let intersects = this.rayCaster.intersectObjects(
			this.sceneHelper.THREEScene.children.filter((object) => object !== this.ground)
		);
		if (intersects.length > 0) {
			intersects.forEach((intersection) => {
				let object = intersection.object;
				if (this.selectedObject !== object) {
					if (this.selectedObject) {
						this.selectedObject.material.color.setHex(this.selectedObject.previousColor);
					}

					this.selectedObject = object;
					this.selectedObject.previousColor = object.material.color.getHex();
					object.material.color.setHex(0xff0000);
				}
		});
		} else if (this.selectedObject) {
			this.selectedObject.material.color.setHex(this.selectedObject.previousColor);
			this.selectedObject = null;
		}
	}

	renderLoop = () => {
		this.rendererHelper.render(this.sceneHelper.THREEScene, this.cameraHelper.THREECamera);
		requestAnimationFrame(this.renderLoop);
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

	addObject = (object) => {
		this.objectList.push({
			id: object.id,
			name: object.name,
			vertices: object instanceof THREE.ArrowHelper ?
				object.userData.vertices :
				object.geometry.vertices
		});
		this.sceneHelper.addObject(object);
	}

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

	updateGround = (size) => {
		this.sceneHelper.removeObject(this.ground.id);
		this.groundSize = size;
		this.ground = ObjectHelper.createGround(this.groundSize);
		this.sceneHelper.addObject(this.ground);
	};

	removeObject = (id) => {
		this.objectList = this.objectList.filter((object) => object.id !== id);
		this.sceneHelper.removeObject(id);
	}

	setDisplayMode = (mode) => {
		if (mode === this.currentDisplayMode) {
			return;
		}

		this.currentDisplayMode = mode;
		this.sceneHelper.applyDisplayMode(this.currentDisplayMode, this.ground);
	}
}