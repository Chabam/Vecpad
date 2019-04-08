import * as THREE from 'three';
import * as OrbitControls from './Extras/OrbitControls';

/*
	The wrapper object around the THREE.js camera. We use a fixed camera
	with OrbitControls.
*/
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

	// Set the focus point of the camera to a specific coordinate.
	focusOnCoords = (coords) => {
		this.THREEControls.target.copy(coords);
		this.THREEControls.update();
	}

	/*
		Same as 'focusOnCoords' but using the object's center and updating,
		when the object changes.
	*/
	focusObject = (object) => {
		let cbId = object.registerCallback((changedObject, deleted) => {
			if (!deleted) {

				this.focusOnCoords(changedObject.getCenter());
			} else {
				this.unfocusObject();
			}
		});
		this.focusedObject = {
			cbId,
			object
		};

		this.focusOnCoords(object.getCenter());
		object.updateScene();
	}

	// Set back the focus to the center of the grid.
	unfocusObject = () => {
		if (!this.focusedObject) return;

		let { cbId, object } = this.focusedObject;
		object.unregisterCallback(cbId);
		object.updateScene();
		this.focusedObject = null;
		this.focusOnCoords(new THREE.Vector3(0, 0, 0));
	}
}