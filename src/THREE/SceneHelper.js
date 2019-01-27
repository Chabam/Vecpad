import * as THREE from 'three';

export default class SceneHelper {
    constructor() {
        this.THREEScene = new THREE.Scene();
    }

    addObject(object) {
        this.THREEScene.add(object.mesh);
        if (object.labelSprite) {
            this.THREEScene.add(object.labelSprite);
        }
    }
}