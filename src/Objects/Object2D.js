import * as THREE from 'three';
import VecpadObject from './VecpadObject';

export default class Object2D extends VecpadObject {
    constructor(geometry, color=0x000000, label=null) {
        super(geometry);
        this.mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            color: false
        }));
        let edges = new THREE.EdgesGeometry(geometry);
        let outline = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
            color: color,
            depthTest: false
        }));
        this.mesh.add(outline);
        if (label) {
            this.createLabel(label, geometry.vertices);
        }
    }
}