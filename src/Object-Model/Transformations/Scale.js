import Transformation from "./Transformation";
import * as THREE from 'three';

export default class Scale extends Transformation {
	constructor(x, y, z) {
		super();
		this.name = 'Scale';
		this.x = x;
		this.y = y;
		this.z = z;
	}

	getMatrix = () => {
		return new THREE.Matrix4().makeScale(
			(1 + (this.x - 1) * this.step) || 0.00000001,
			(1 + (this.y - 1) * this.step) || 0.00000001,
			(1 + (this.z - 1) * this.step) || 0.00000001
		);
	}

	toJSON = () => {
		return {
			name: this.name,
			x: this.x,
			y: this.y,
			z: this.z
		}
	}
}