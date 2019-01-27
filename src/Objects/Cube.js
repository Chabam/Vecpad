import Object3D from './Object3D';
import * as THREE from 'three';

export default class Cube extends Object3D {
    constructor(width, height, depth, color, label) {
        super(new THREE.BoxGeometry(width, height, depth), color, label);
    }
}
