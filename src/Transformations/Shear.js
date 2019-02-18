import Transformation from "./Transformation";
import * as THREE from 'three';

export default class Shear extends Transformation {
	constructor(x, y, z) {
		super();
		this.name = `Shear of (${x}, ${y}, ${z})`
		this.x = x;
		this.y = y;
		this.z = z;
	}

	getMatrix = () => new THREE.Matrix4().makeShear(
		this.x * this.currentStep,
		this.y * this.currentStep,
		this.z * this.currentStep,
	);
}