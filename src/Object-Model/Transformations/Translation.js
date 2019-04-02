import Transformation from "./Transformation";
import * as THREE from 'three';

export default class Translation extends Transformation {
	constructor(x, y, z) {
		super();
		this.name = 'Translation';
		this.x = x;
		this.y = y;
		this.z = z;
	}

	getMatrix = () => new THREE.Matrix4().makeTranslation(
		this.x * this.step,
		this.y * this.step,
		this.z * this.step,
	);

	toJSON = () => {
		return {
			name: this.name,
			x: this.x,
			y: this.y,
			z: this.z
		}
	}
}