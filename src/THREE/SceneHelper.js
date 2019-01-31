import * as THREE from 'three';

export default class SceneHelper {
    constructor() {
        this.THREEScene = new THREE.Scene();
        this.groundSize = 2;
        this.ground = this.createGround(this.groundSize);
        this.THREEScene.add(this.ground);
    }

    addObject(object) {
        this.THREEScene.add(object.mesh);
    }

    createGround(subdivision) {
        if (subdivision % 2 === 1) {
            console.warn(`The ground has to be divisible by two, you provided ${subdivision}. It will be changed to ${subdivision + 1}.`)
            subdivision = subdivision + 1;
        }
        let lines = new THREE.Geometry();
        let maxCoord = subdivision/2;
        let minCoord = -maxCoord;

        let topLeft     = new THREE.Vector3(minCoord, 0, minCoord);
        let topRight    = new THREE.Vector3(maxCoord, 0, minCoord);
        let bottomLeft  = new THREE.Vector3(minCoord, 0, maxCoord);
        let bottomRight = new THREE.Vector3(maxCoord, 0, maxCoord);

        lines.vertices.push(
            topLeft, topRight,
            topRight, bottomRight,
            bottomRight, bottomLeft,
            bottomLeft, topLeft
        );

        for (let i = 1; i < subdivision; i++) {
            let currentValue = minCoord + i;
            let currentXCoord = new THREE.Vector3(currentValue, 0, minCoord);
            let currentZCoord = new THREE.Vector3(minCoord, 0, currentValue);
            let destXCoord    = new THREE.Vector3(currentValue, 0, maxCoord);
            let destZCoord    = new THREE.Vector3(maxCoord, 0, currentValue);
            lines.vertices.push(
                currentXCoord, destXCoord,
                currentZCoord, destZCoord
            );
        }

        let ground = new THREE.LineSegments(lines, new THREE.LineBasicMaterial({
            color: 0x555555,
        }));

        let subLines = new THREE.Geometry();
        for (let i = 1; i < subdivision * 4; i++) {
            let currentValue = minCoord + (i / 4);

            if (Number.isInteger(currentValue)) {
                continue;
            }
            let currentXCoord = new THREE.Vector3(currentValue, 0, minCoord);
            let currentZCoord = new THREE.Vector3(minCoord, 0, currentValue);
            let destXCoord    = new THREE.Vector3(currentValue, 0, maxCoord);
            let destZCoord    = new THREE.Vector3(maxCoord, 0, currentValue);
            subLines.vertices.push(
                currentXCoord, destXCoord,
                currentZCoord, destZCoord
            );
        }
        let subdividedGround = new THREE.LineSegments(subLines, new THREE.LineBasicMaterial({
            color: 0xcccccc,
        }));

        ground.add(subdividedGround);

        return ground;
    }
}