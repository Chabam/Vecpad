import * as THREE from 'three';

export default class SceneHelper {
    constructor() {
        this.THREEScene = new THREE.Scene();
        this.FILL = 0;
        this.OUTLINE = 1;
        this.BOTH = 2;
        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
        this.directionalLight.position.set(1, 1, 1).normalize();
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5);
        this.addObject(this.directionalLight, this.ambientLight, this.hemisphereLight);
    }

    addObject(...object) {
        this.THREEScene.add(...object);
    }

    applyDisplayMode(mode, ground) {
        this.THREEScene.children.forEach((object) => {
            if (object === ground || object instanceof THREE.Light) {
                return;
            }

            object.material.transparent = (mode === this.OUTLINE);
            object.children[0].material.transparent = (mode === this.FILL);
        });
    }
}