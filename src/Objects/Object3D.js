import * as THREE from 'three';
import VecpadObject from './VecpadObject';

export default class Object3D extends VecpadObject {
    constructor(geometry, color=0x000000, label=null) {
        let edges = new THREE.EdgesGeometry(geometry);
        let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            color: false,
            side: THREE.DoubleSide,
            depthTest: true,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        }));
        let frontFace = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
            color: color,
            depthTest: true,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        }));
        let backFace = new THREE.LineSegments(edges, new THREE.LineDashedMaterial({
            color: color,
            dashSize: 0.05,
            gapSize: 0.05,
            depthTest: false,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        }));
        backFace.computeLineDistances();
        mesh.add(frontFace, backFace);
        super(mesh);
        if (label) {
            this.createLabel(label, geometry.vertices);
        }
    }
}