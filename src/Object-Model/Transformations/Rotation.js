import Transformation from "./Transformation";
import * as THREE from 'three';

export default class Rotation extends Transformation {
	constructor(axis, angle) {
		super();
		this.name = 'Rotation';
		this.axis = axis;
		this.angle = angle;
	}

	getMatrix = () => new THREE.Matrix4().makeRotationAxis(
		this.axis,
		THREE.Math.degToRad(this.angle) * this.step
	);

	toJSON = () => {
		return {
			name: this.name,
			axis: {
				x: this.axis.x,
				y: this.axis.y,
				z: this.axis.z
			},
			angle: this.angle
		}
	}
}