import * as THREE from 'three';
import VecpadOperation from './VecpadOperation';

export default class VectorSubtraction extends VecpadOperation{
	constructor(updateSceneFunc) {
		super(
			(v1, v2) => new THREE.Vector3().subVectors(v1, v2),
			'New vector subtraction',
			updateSceneFunc
		);
	}
}