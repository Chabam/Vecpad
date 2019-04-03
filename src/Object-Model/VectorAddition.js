import * as THREE from 'three';
import VecpadOperation from './VecpadOperation';

export default class VectorAddition extends VecpadOperation {
	constructor(updateSceneFunc) {
		super(
			(v1, v2) => new THREE.Vector3().addVectors(v1, v2),
			'New vector addtion',
			updateSceneFunc
		);
	}
}