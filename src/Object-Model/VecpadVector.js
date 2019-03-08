import * as THREE from 'three';
import VecpadObjectMixin from './VecpadObjectMixin';
import SceneHelper from './THREE/SceneHelper';

export default class VecpadVector extends THREE.Line {
    constructor(direction, color=0x000000, label, reactUpdateFunc) {
        let vectorGeometry = new THREE.Geometry();
        let origin = new THREE.Vector3(0, 0, 0);

        vectorGeometry.vertices.push(
			origin,
			direction
        );
        vectorGeometry.computeBoundingBox();
        vectorGeometry.dynamic = true;

        super(vectorGeometry, new THREE.LineBasicMaterial({
			color: color
        }));

        this.color = color;
        this.type = 'Vector';

        let arrowGeometry = new THREE.ConeGeometry(0.05, 0.05, 10);
		let arrow = new THREE.Mesh(arrowGeometry, new THREE.MeshBasicMaterial({
			color: color
		}));

		this.arrow = arrow;
        this.add(arrow);

        this.operations = [];
        this.vectorsFromOperations = [];
        this.vector = direction;
        this.originalVector = this.vector;

        this.alignArrowOnVector(direction);

        VecpadObjectMixin.call(this, label, reactUpdateFunc);
    }

	applyTransformations = (step) => {
        this.currentStep = step;

        let stepPerTrans = 1 / (this.transformations.length);
        let currentTrans = Math.floor(step / stepPerTrans);
        let stepInCurrentTrans = (step * this.transformations.length) - currentTrans;

        this.matrix.copy(this.originalMatrix);

        let transMatrix = this.transformations.slice(0, currentTrans).reduce((matrix, trans) =>
            trans.getMatrix(1).multiply(matrix),
            new THREE.Matrix4()
        );

        if (currentTrans < this.transformations.length) {
            transMatrix = this.transformations[currentTrans]
                .getMatrix(stepInCurrentTrans).multiply(transMatrix);
        }

        this.vector = this.originalVector.clone().applyMatrix4(transMatrix);
        this.arrow.position.copy(origin);
        this.arrow.matrix = new THREE.Matrix4();
        this.alignArrowOnVector();
        this.geometry.vertices[1] = this.vector;
        this.geometry.verticesNeedUpdate = true;

        this.computeLabelPosition();
        this.callbacks.forEach((callback) => {
            callback.func(this);
        })
        this.updateReact();
    }

    updateColor = (color) => this.originalColor = color;

    select = () => {
        this.label.element.classList.add('selected');

        let {arrow, material} = this;
        this.originalColor = material.color.getHex();
        material.color.setHex(SceneHelper.SELECTED_COLOR);
        arrow.material.color.setHex(SceneHelper.SELECTED_COLOR);
        material.linewidth = SceneHelper.SELECTED_LINEWIDTH;

        this.renderOrder = 1;
        arrow.renderOrder = 1;
        material.depthTest = false;
        arrow.material.depthTest = false;
    }

    deselect = () => {
        this.label.element.classList.remove('selected');

        let { arrow, material, originalColor} = this;
        material.color.setHex(originalColor);
        material.linewidth = SceneHelper.UNSELECTED_LINEWIDTH;
        arrow.material.color.setHex(originalColor);
        delete this.originalColor;

        this.renderOrder = 0;
        arrow.renderOrder = 0;
        material.depthTest = true;
        arrow.material.depthTest = true;
    }

    updateOperations = () => {
        this.vectorsFromOperations.forEach((vector) => {
            vector.remove(vector.label);
            this.remove(vector);
        });
        this.vectorsFromOperations = [];
        let modifiedVector = this.vector.clone().applyMatrix4(this.matrix);
        this.operations.forEach((operation) => {
            let {operationFunc, label, color} = operation;
            let newVector = new VecpadVector(operationFunc(modifiedVector), color, label, this.reactUpdateFunc);
            newVector.applyMatrix(new THREE.Matrix4().getInverse(this.matrix, false));
            this.vectorsFromOperations.push(newVector);
            this.add(newVector);
        })
    };

    addCrossProduct = (vecpadVector, color, label=null) => {
        this.addOperation(
            (newVector) => new THREE.Vector3().crossVectors(
                newVector,
                vecpadVector.vector.clone().applyMatrix4(vecpadVector.matrix)
            ),
            vecpadVector,
            color,
            label || `${this.name} X ${vecpadVector.name}`
        );
    }

    addVectorAddition = (vecpadVector, color, label=null) => {
        this.addOperation(
            (newVector) => new THREE.Vector3().addVectors(
                newVector,
                vecpadVector.vector.clone().applyMatrix4(vecpadVector.matrix)
            ),
            vecpadVector,
            color,
            label || `${this.name} + ${vecpadVector.name}`
        );
    }

    addVectorSubtraction = (vecpadVector, color, label=null) => {
        this.addOperation(
            (newVector) => new THREE.Vector3().subVectors(
                newVector,
                vecpadVector.vector.clone().applyMatrix4(vecpadVector.matrix)
            ),
            vecpadVector,
            color,
            label || `${this.name} - ${vecpadVector.name}`
        );
    }

    addOperation = (operationFunc, vecpadVector, color=0x000000, label) => {
        let cbId = vecpadVector.registerCallback(this.updateOperations);
        this.operations.push({
            operationFunc,
            vecpadVector,
            label,
            color,
            cbId
        });

        this.updateOperations();
    }

    removeOperation = (operation) => {
        let { cbId, vecpadVector } = operation;
        vecpadVector.unregisterCallback(cbId);
        this.operations = this.operations.filter((op) => op !== operation);
        this.updateOperations();
    }


    updateDirection = (direction) => {
        let origin = new THREE.Vector3(0, 0, 0);

        this.vector = direction;
        this.originalVector = this.vector;

        this.arrow.position.copy(origin);
        this.arrow.matrix = new THREE.Matrix4();
        this.alignArrowOnVector();
        this.geometry.vertices[1] = this.vector;
        this.geometry.verticesNeedUpdate = true;
        this.computeLabelPosition();

        this.updateReact();
    }

    alignArrowOnVector = () => {
        let up = new THREE.Vector3(0, 1, 0);

        let rotationAxis;
        let rotationAngle;
        let normalizedDirection = this.vector.clone().normalize();
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
			rotationAxis = new THREE.Vector3().crossVectors(up, normalizedDirection).normalize();
			rotationAngle = Math.acos(up.dot(normalizedDirection));
        }
        let rotationMatrix = new THREE.Matrix4().makeRotationAxis(rotationAxis, rotationAngle);

        this.arrow.applyMatrix(rotationMatrix);
        this.arrow.position.copy(this.vector);
    }

    clean = () => {
        this.remove(this.label);
        this.operations.forEach((operation) => {
            let { cbId, vecpadVector } = operation;
            vecpadVector.unregisterCallback(cbId);
        });
        this.vectorsFromOperations.forEach((vector) => {
            vector.remove(vector.label);
        })
    }
}
