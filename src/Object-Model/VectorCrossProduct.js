import * as THREE from 'three';
import VecpadOperation from './VecpadOperation';

export default class VectorCrossProduct extends VecpadOperation {
	constructor(updateSceneFunc) {
		super(
			(v1, v2) => new THREE.Vector3().crossVectors(v1, v2),
			'New cross product',
			updateSceneFunc
		);
	}
}