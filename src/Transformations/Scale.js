import Transformation from "./Transformation";
import * as THREE from 'three';

export default class Scale extends Transformation {
	constructor(x, y, z) {
		super();
		this.name = `Scale of (${x}, ${y}, ${z})`
		this.x = x;
		this.y = y;
		this.z = z;
	}

	getMatrix = () => {
		return new THREE.Matrix4().makeScale(
			1 + (this.x - 1) * this.currentStep,
			1 + (this.y - 1) * this.currentStep,
			1 + (this.z - 1) * this.currentStep
		);
	}
}