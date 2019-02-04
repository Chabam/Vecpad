import * as THREE from 'three';
import * as OrbitControls from './Extras/OrbitControls';

export default class CameraWrapper {
	constructor() {
		this.THREECamera = null;
		this.THREEControls = null;
	}

	init = (ratio, rendererDomElement) => {
		this.THREECamera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
		this.THREECamera.position.z = 3;
		this.THREEControls = new OrbitControls(this.THREECamera, rendererDomElement);
	}

	setAspectRatio = (ratio) => {
		this.THREECamera.aspect = ratio;
		this.THREECamera.updateProjectionMatrix();
	}
}