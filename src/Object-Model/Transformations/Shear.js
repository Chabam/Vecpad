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

	getMatrix = (step) => {
		let { xY, xZ, yX, yZ, zX, zY } = this;
		let amountXY = xY * step;
		let amountXZ = xZ * step;
		let amountYX = yX * step;
		let amountYZ = yZ * step;
		let amountZX = zX * step;
		let amountZY = zY * step;
		return new THREE.Matrix4().set(
			1, amountXY, amountXZ, 0,
			amountYX, 1, amountYZ, 0,
			amountZX, amountZY, 1, 0,
			0,        0,        0, 1
		);
	}
}