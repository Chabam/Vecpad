import * as THREE from 'three';

export default class Transformation {
	constructor() {
		this.uuid = THREE.Math.generateUUID();
		this.name = 'No transformation';
		this.step = 0;
		this.showMatrix = false;
	}

	getMatrix = () => new THREE.Matrix4();

	toJSON = () => {
		return {};
	}
}