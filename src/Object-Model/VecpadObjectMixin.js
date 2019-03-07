import * as THREE from 'three';
import ObjectHelper from './THREE/ObjectHelper';
import Translation from './Transformations/Translation';
import Scale from './Transformations/Scale';
import Rotation from './Transformations/Rotation';
import Shear from './Transformations/Shear';


export default function(label, reactUpdateFunc) {
    this.name = label || `Object #${this.id}`;
    let objectLabel = ObjectHelper.createLabel(this.name);
    objectLabel.matrixAutoUpdate = false;
    this.label = objectLabel;
    this.add(this.label);
    this.updateReact = reactUpdateFunc;

    this.computeLabelPosition = () => {
        /*
			To set the positions of the label, we set it at the highest point in the Y axis
			and the average of the X and Z axis.
		*/
		let worldPositions = this.geometry.vertices.map((vertex) => {
			return vertex.clone().applyMatrix4(this.matrix);
		});

		let average = vertices => vertices.reduce((sum, elem) => elem + sum, 0) / vertices.length;

		let x = average(worldPositions.map((elem) => elem.x));
        let y = this.type !== 'Vector' ?
            Math.max(...worldPositions.map((elem) => elem.y)) :
            average(worldPositions.map((elem) => elem.y));
		let z = average(worldPositions.map((elem) => elem.z));

		let translationToPos = new THREE.Matrix4().makeTranslation(x, y + 0.05, z);
		this.label.matrix.copy(new THREE.Matrix4());
		this.label.applyMatrix(new THREE.Matrix4().getInverse(this.matrix, false).multiply(translationToPos));
    }

    this.computeLabelPosition();

    this.matrixAutoUpdate = false;
    this.originalMatrix = this.matrix.clone();
    this.transformations = [];
    this.currentStep = 1;
    this.currentCallbackId = 0;
    this.callbacks = []

    this.registerCallback = (func) => {
        let id = this.currentCallbackId++;
        this.callbacks.push({
            id,
            func: (changedObject) => func(changedObject)
        });
        return id;
    }

    this.unregisterCallback = (id) => {
        this.callbacks = this.callbacks.filter((callback) => callback.id !== id);
    }

	this.applyTransformations = (step) => {
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

        this.applyMatrix(transMatrix);
        this.computeLabelPosition();
        this.callbacks.forEach((callback) => {
            callback.func(this);
        })
        this.updateReact();
    }

    this.addTransformation = (transformation) => {
        transformation.prioritize = () => {
            let currentIndex = this.transformations.indexOf(transformation);
            if (currentIndex !== 0) {
                this.swapTransformations(currentIndex, currentIndex - 1);
            }
        }

        transformation.deprioritize = () => {
            let currentIndex = this.transformations.indexOf(transformation);
            if (currentIndex !== this.transformations.length - 1) {
                this.swapTransformations(currentIndex, currentIndex + 1);
            }
        }

        this.transformations.push(transformation);
        this.applyTransformations(1);
    }

    this.addTranslation = (x, y, z) => {
        this.addTransformation(new Translation(x, y, z));
    }

    this.addScale = (x, y, z) => {
        this.addTransformation(new Scale(x, y, z));
    }

    this.addShear = (xy, xz, yx, yz, zx, zy) => {
        this.addTransformation(new Shear(xy, xz, yx, yz, zx, zy));
    }

    this.addRotation = (axis, angle) => {
        this.addTransformation(new Rotation(axis, angle));
    }

    this.removeTransformation = (transformation) => {
        this.transformations = this.transformations.filter((trans) => trans !== transformation);
        this.applyTransformations(1);
        this.updateReact();
    }

    this.swapTransformations = (i, j) => {
        [this.transformations[i], this.transformations[j]] = [this.transformations[j], this.transformations[i]];
        this.applyTransformations(1);
    }

    this.updateLabel = (text) => {
        this.remove(this.label);
        this.name = text;
        let objectLabel = ObjectHelper.createLabel(this.name);
        objectLabel.matrixAutoUpdate = false;
        this.label = objectLabel;
        this.add(this.label);
        this.computeLabelPosition();
        this.updateReact();
    }
};