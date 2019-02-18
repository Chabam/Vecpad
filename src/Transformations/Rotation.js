import Transformation from "./Transformation";
import * as THREE from 'three';

export default class Translation extends Transformation {
	constructor(axis, angle) {
		super();
		let { x, y, z } = axis;
		this.name = `Rotation of ${angle} radian on (${x}, ${y}, ${z})`
		this.axis = axis;
		this.angle = angle;
	}

	getMatrix = () => new THREE.Matrix4().makeRotationAxis(
		this.axis,
		this.angle * this.currentStep
	);
}