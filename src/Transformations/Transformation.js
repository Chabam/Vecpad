import * as THREE from 'three';
import THREEHelper from '../THREE/THREEHelper';

export default class Transformation {
	constructor() {
		this.uuid = THREE.Math.generateUUID();
		this.name = 'No transformation';
	}

	getMatrix = () => new THREE.Matrix4();

	viewMatrix = () => {
		let splittedMatrix = this.getMatrix(1).transpose().elements
		.map(THREEHelper.displayFloat)
		.reduce((result, value, index, array) => {
			if (index % 4 === 0)
				result.push(array.slice(index, index + 4));
			return result;
		}, []);
		let formarttedMatrix = splittedMatrix.map((row) => `[${row.join(',')}]`).join(',')
		return `[${formarttedMatrix}]`;
	}
}