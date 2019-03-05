import Transformation from "./Transformation";
import * as THREE from 'three';

export default class Translation extends Transformation {
	constructor(x, y, z) {
		super();
		this.name = `Translation of (${x}, ${y}, ${z})`;
		this.x = x;
		this.y = y;
		this.z = z;
	}

	getMatrix = (step) => new THREE.Matrix4().makeTranslation(
		this.x * step,
		this.y * step,
		this.z * step,
	);
}