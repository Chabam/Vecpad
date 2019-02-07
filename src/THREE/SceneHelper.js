import * as THREE from 'three';
import THREEHelper from './THREEHelper';

// A wrapper around the scene in THREE.js
export default class SceneHelper {
	constructor() {
		this.THREEScene = new THREE.Scene();

		// The different light sources are defined here.
		this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
		this.directionalLight.position.set(1, 1, 1).normalize();
		this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		this.hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5);
		this.addObject(this.directionalLight, this.ambientLight, this.hemisphereLight);
	}

	// This function add one or multiple objects to the scene.
	addObject = (...object) => {
		this.THREEScene.add(...object);
	}

	// The function removes the object from the scene with an ID.
	removeObject = (id) => {
		let object = this.THREEScene.getObjectById(id);

		// For some reason we need to manually remove the label.
		object.remove(object.label);
		this.THREEScene.remove(object);
	}

	// This function changes the way an object is displayed
	applyDisplayMode = (mode, ground) => {
		this.THREEScene.children.filter((object) =>
			// We don't change the ground, lights and vector objects.
			!(
				object === ground ||
				object instanceof THREE.Light ||
				object instanceof THREE.Line
			)
		).forEach((object) => {

			// See THREEHelper's display mode for details.
			object.material.transparent = (mode === THREEHelper.OUTLINE);
			object.outline.material.transparent = (mode === THREEHelper.FILL);
		});
	}
}