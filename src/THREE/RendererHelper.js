import * as THREE from 'three';

export default class RendereHelper {
    constructor() {
        this.THREERenderer = null;
    }

    init(width, height) {
        this.THREERenderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.THREERenderer.setClearColor(0xffffff);
        this.setSize(width, height);
        return this.THREERenderer.domElement;
    }

    setSize(width, height) {
        this.THREERenderer.setSize(width, height);
    }

    render(scene, camera) {
        this.THREERenderer.render(scene, camera);
    }
}