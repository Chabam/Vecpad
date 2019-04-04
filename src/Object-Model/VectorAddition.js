import * as THREE from 'three';
import VecpadOperation from './VecpadOperation';

export default class VectorAddition extends VecpadOperation {
	constructor(color, label, updateSceneFunc) {
		super(
			(v1, v2) => new THREE.Vector3().addVectors(v1, v2),
			color,
			label,
			updateSceneFunc
		);
	}

	toJSON = () => ({
		uuid: this.uuid,
		name: this.name,
		type: this.type,
		color: this.material.color.getHex(),
		operation: 'Addition',
		v1: this.v1 ? this.v1.uuid : null,
		v2: this.v2 ? this.v2.uuid : null,
		transformations: this.transformations.reduce(
			(trans, currentTrans) => {
				trans.push(currentTrans.toJSON());
				return trans;
			},
			[]
		)
	});
}