import Object2D from './Object2D';
import * as THREE from 'three';

export default class Triangle extends Object2D {
    constructor(p1, p2, p3, color, label) {
        let geometry = new THREE.Geometry();
        geometry.vertices.push(p1, p2, p3);
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        super(geometry, color, label);
    }
}