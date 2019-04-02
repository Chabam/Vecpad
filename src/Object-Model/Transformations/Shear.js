import Transformation from "./Transformation";
import * as THREE from 'three';

export default class Shear extends Transformation {
	constructor(xY, xZ, yX, yZ, zX, zY) {
		super();
		this.name = 'Shear';
		this.xY = xY;
		this.xZ = xZ;
		this.yX = yX;
		this.yZ = yZ;
		this.zX = zX;
		this.zY = zY;
	}

	getMatrix = () => {
		let { xY, xZ, yX, yZ, zX, zY } = this;
		let amountXY = xY * this.step;
		let amountXZ = xZ * this.step;
		let amountYX = yX * this.step;
		let amountYZ = yZ * this.step;
		let amountZX = zX * this.step;
		let amountZY = zY * this.step;
		return new THREE.Matrix4().set(
			1, amountXY, amountXZ, 0,
			amountYX, 1, amountYZ, 0,
			amountZX, amountZY, 1, 0,
			0,        0,        0, 1
		);
	}

	toJSON = () => {
		return {
			name: this.name,
			xY: this.xY,
			xZ: this.xZ,
			yX: this.yX,
			yZ: this.yZ,
			zX: this.zX,
			zY: this.zY
		}
	}
}