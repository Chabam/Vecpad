import * as THREE from 'three';
import VecpadOperation from './VecpadOperation';

export default class VectorSubtraction extends VecpadOperation{
	constructor(color, label, updateSceneFunc) {
		super(
			(v1, v2) => new THREE.Vector3().subVectors(v1, v2),
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
		operation: 'Subtraction',
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