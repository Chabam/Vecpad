import * as THREE from 'three';

export default class Transformation {
	constructor() {
		this.uuid = THREE.Math.generateUUID();
		this.name = 'No transformation';
		this.step = 0;
	}

	getMatrix = () => new THREE.Matrix4();
}