import Transformation from "./Transformation";
import * as THREE from 'three';

export default class Shear extends Transformation {
	constructor(xY, xZ, yX, yZ, zX, zY) {
		super();
		this.name = `Shear of (${xY}, ${xZ}, ${yX}, ${yZ}, ${zX}, ${zY})`;
		this.xY = xY;
		this.xZ = xZ;
		this.yX = yX;
		this.yZ = yZ;
		this.zX = zX;
		this.zY = zY;
	}

	getMatrix = () => {
		let { xY, xZ, yX, yZ, zX, zY } = this;
		let amountXY = xY * this.currentStep;
		let amountXZ = xZ * this.currentStep;
		let amountYX = yX * this.currentStep;
		let amountYZ = yZ * this.currentStep;
		let amountZX = zX * this.currentStep;
		let amountZY = zY * this.currentStep;
		return new THREE.Matrix4().set(
			1, amountXY, amountXZ, 0,
			amountYX, 1, amountYZ, 0,
			amountZX, amountZY, 1, 0,
			0,        0,        0, 1
		);
	}
}