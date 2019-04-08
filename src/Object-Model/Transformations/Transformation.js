import * as THREE from 'three';

// A class used to encapsulate transformations.
export default class Transformation {
	constructor(object) {
		this.uuid = THREE.Math.generateUUID();
		this.name = 'No transformation';
		this.object = object;

		// The proportion of the transformation to apply (between 0 and 1)
		this.step = 1;
		this.showMatrix = false;

		// VecpadObject function to hook with, mainly for shortness sake
		this.updateTransformationList = this.object.updateTransformationList;
		this.applyTransformations = this.object.applyTransformations;
		this.updateScene = this.object.updateScene;
	}

	// Move to the left in the object's transformation list
	prioritize = () => {
		let currentIndex = this.object.transformations.indexOf(this);
		if (currentIndex !== 0) {
			this.object.swapTransformations(currentIndex, currentIndex - 1);
		}
	}

	// Move to the right in the object's transformation list
	deprioritize = () => {
		let currentIndex = this.object.transformations.indexOf(this);
		if (currentIndex !== this.object.transformations.length - 1) {
			this.object.swapTransformations(currentIndex, currentIndex + 1);
		}
	}

	// Get the matrix of the transformation multiplied by the step
	getMatrix = () => new THREE.Matrix4();

	toJSON = () => ({});

	// An helper function to communicate with React easily.
	updateTransformationValue = (valueName, value) => {
		this[valueName] = value;

		this.applyTransformations(1);
		this.updateTransformationList();
	};
}