import * as THREE from 'three';

export default class ObjectHelper {
    createGround(subdivision) {
        if (subdivision % 2 === 1) {
            console.warn(`The ground has to be divisible by two, you provided ${subdivision}. It will be changed to ${subdivision + 1}.`)
            subdivision = subdivision + 1;
        }
        let maxCoord = subdivision/2;
        let minCoord = -maxCoord;

        let topLeft     = new THREE.Vector3(minCoord, 0, minCoord);
        let topRight    = new THREE.Vector3(maxCoord, 0, minCoord);
        let bottomLeft  = new THREE.Vector3(minCoord, 0, maxCoord);
        let bottomRight = new THREE.Vector3(maxCoord, 0, maxCoord);

        let lines = new THREE.Geometry();
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
            color: 0x555555
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
            color: 0xcccccc
        }));

        ground.add(subdividedGround);

        return ground;
    }

    createTriangle(width, color, outlineColor) {
        let p1 = new THREE.Vector3(0, 0, 0);
        let p2 = new THREE.Vector3(width, 0, 0);
        let p3 = new THREE.Vector3(width, width, 0);
        let triangleGeometry = new THREE.Geometry();
        triangleGeometry.vertices.push(p1, p2, p3);
        triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
        return this.createObject(triangleGeometry, color, outlineColor);
    }

    createQuad(width, heigth, color, outlineColor) {
        return this.createObject(new THREE.PlaneGeometry(width, heigth), color, outlineColor);
    }

    createCube(width, heigth, depth, color, outlineColor) {
        return this.createObject(new THREE.BoxGeometry(width, heigth, depth), color, outlineColor);
    }

    createMesh(geometry, color) {
        return new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
            color: color,
            side: THREE.DoubleSide,
            opacity: 0
        }));
    }

    createOutlines(geometry, color) {
        let egdes = new THREE.EdgesGeometry(geometry);
        return new THREE.LineSegments(egdes, new THREE.LineBasicMaterial({
            color: color,
            opacity: 0
        }));
    }

    createObject(geometry, color=0xffffff, outlineColor=0x000000) {
        let object = this.createMesh(geometry, color);
        let objectOutlines = this.createOutlines(geometry, outlineColor);
        objectOutlines.name = 'outline';
        object.add(objectOutlines);
        return object;
    }

}