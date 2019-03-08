import * as THREE from 'three';
import * as OrbitControls from './Extras/OrbitControls';

// The wrapper object around the THREE.js camera.
export default class CameraWrapper {
	constructor() {
		this.THREECamera = null;
		this.THREEControls = null;
		this.focusedObject = null;
	}

	init = (ratio, rendererDomElement) => {
		this.THREECamera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
		this.THREECamera.position.z = 3;
		this.THREEControls = new OrbitControls(this.THREECamera, rendererDomElement);
		this.THREEControls.enablePan = false;
	}

	setAspectRatio = (ratio) => {
		this.THREECamera.aspect = ratio;
		this.THREECamera.updateProjectionMatrix();
	}

	focusOnCoords = (coords) => {
		this.THREEControls.target.copy(coords);
		this.THREEControls.update();
	}

	focusObject = (object) => {
		let cbId = object.registerCallback((changedObject) => this.focusOnCoords(changedObject.position));
		this.focusedObject = {
			cbId,
			object
		}
		this.focusOnCoords(object.position);
		object.updateReact();
	}

	unfocusObject = () => {
		let { cbId, object } = this.focusedObject;
		object.unregisterCallback(cbId);
		object.updateReact();
		this.focusedObject = null;
		this.reset();
	}

	reset = () => this.focusOnCoords(new THREE.Vector3(0, 0, 0));
}