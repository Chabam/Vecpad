import * as THREE from 'three';

export default class Transformation {
	constructor(object) {
		this.uuid = THREE.Math.generateUUID();
		this.name = 'No transformation';
		this.step = 1;
		this.showMatrix = false;
		this.object = object;

		this.updateTransformationList = this.object.updateTransformationList;
		this.applyTransformations = this.object.applyTransformations;
		this.updateScene = this.object.updateScene;
	}

	prioritize = () => {
		let currentIndex = this.object.transformations.indexOf(this);
		if (currentIndex !== 0) {
			this.object.swapTransformations(currentIndex, currentIndex - 1);
		}
	}

	deprioritize = () => {
		let currentIndex = this.object.transformations.indexOf(this);
		if (currentIndex !== this.object.transformations.length - 1) {
			this.object.swapTransformations(currentIndex, currentIndex + 1);
		}
	}

	getMatrix = () => new THREE.Matrix4();

	toJSON = () => ({});

	updateTransformationValue = (valueName, value) => {
		this[valueName] = value;

		this.applyTransformations(1);
		this.updateTransformationList();
	};
}