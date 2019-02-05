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

	renderLoop = () => {
		requestAnimationFrame(this.renderLoop);
		this.rendererHelper.render(this.sceneHelper.THREEScene, this.cameraHelper.THREECamera);
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