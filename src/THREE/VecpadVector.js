import * as THREE from 'three';
import VecpadObjectMixin from './VecpadObjectMixin';
import SceneHelper from './SceneHelper';

export default class VecpadVector extends THREE.Line {
    constructor(direction, color=0x000000, label, reactUpdateFunc) {
        let vectorGeometry = new THREE.Geometry();
        let origin = new THREE.Vector3(0, 0, 0);
        let up = new THREE.Vector3(0, 1, 0);

        let destination = origin.clone().addScaledVector(up, direction.length());
        vectorGeometry.vertices.push(
			origin,
			destination
        );
        vectorGeometry.computeBoundingBox();

        super(vectorGeometry, new THREE.LineBasicMaterial({
			color: color
        }));

        this.type = 'Vector';

        let arrowGeometry = new THREE.ConeGeometry(0.05, 0.05, 10);
		let arrow = new THREE.Mesh(arrowGeometry, new THREE.MeshBasicMaterial({
			color: color
		}));
		arrow.position.copy(destination);

		let rotationAxis;
        let rotationAngle;
        let normalizedDirection = direction.normalize();
		// This code section aligns the vector object to the direction.
		// If the vector we are trying to align to is exactly the opposite of our up vector
		if (normalizedDirection.equals(new THREE.Vector3(0, -1, 0))) {
			// We just flip the vector upside down
			rotationAxis = new THREE.Vector3(1, 0, 0);
			rotationAngle = Math.PI;
		} else {
			/*
				Otherwise we do the following:
					Rotation axis = V1 x V2
					Rotation angle = arccos(V1 * V2)
					Rotate the vector with the previous values.
			*/
			rotationAxis = up.clone().cross(normalizedDirection).normalize();
			rotationAngle = Math.acos(up.dot(normalizedDirection));
		}

		let rotationMatrix = new THREE.Matrix4().makeRotationAxis(rotationAxis, rotationAngle);
		this.applyMatrix(rotationMatrix);

		this.arrow = arrow;
		this.add(arrow);

		this.vector = direction;

        VecpadObjectMixin.call(this, label, reactUpdateFunc);
        delete this.addTranslation;
    }

    select = () => {
        this.label.element.classList.add('selected');

        let {arrow, material} = this;
        this.originalColor = material.color.getHex();
        material.color.setHex(SceneHelper.SELECTED_COLOR);
        material.linewidth = SceneHelper.SELECTED_LINEWIDTH;
        arrow.material.color.setHex(SceneHelper.SELECTED_COLOR);
        material.depthTest = false;
        arrow.material.depthTest = false;
    }

    deselect = () => {
        this.label.element.classList.remove('selected');

        let { arrow, material, originalColor} = this;
        material.color.setHex(originalColor);
        material.linewidth = SceneHelper.UNSELECTED_LINEWIDTH;
        arrow.material.color.setHex(originalColor);
        material.depthTest = true;
        arrow.material.depthTest = true;
        delete this.originalColor;
    }
}
