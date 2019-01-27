import Object2D from './Object2D';
import * as THREE from 'three';

export default class Plane extends Object2D {
    constructor(height, width, color, label) {
        super(new THREE.PlaneGeometry(width, height), color, label);
    }
}