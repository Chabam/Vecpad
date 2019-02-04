import * as THREE from 'three';
import { CSS2DRenderer } from './Extras/CSS2DRenderer';

export default class RendereHelper {
	constructor() {
		this.THREE3DRenderer = null;
		this.THREE2DRenderer = null;
	}

	init = (width, height) => {
		this.THREE3DRenderer = new THREE.WebGLRenderer({
			antialias: true
		});
		this.THREE2DRenderer = new CSS2DRenderer();

		this.THREE3DRenderer.setClearColor(0xffffff);
		this.THREE2DRenderer.domElement.style.position = 'absolute';
		this.THREE3DRenderer.setPixelRatio(window.devicePixelRatio);
		this.setSize(width, height);

		return {
			THREE3DRendererDom : this.THREE3DRenderer.domElement,
			THREE2DRendererDom : this.THREE2DRenderer.domElement,
		};
	}

	setSize = (width, height) => {
		this.THREE3DRenderer.setSize(width, height);
		this.THREE2DRenderer.setSize(width, height);
	}

	render = (scene, camera) => {
		this.THREE3DRenderer.render(scene, camera);
		this.THREE2DRenderer.render(scene, camera);
	}
}