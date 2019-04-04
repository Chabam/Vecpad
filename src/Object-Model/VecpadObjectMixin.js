import * as THREE from 'three';
import ObjectHelper from './THREE/ObjectHelper';
import Scale from './Transformations/Scale';
import Rotation from './Transformations/Rotation';
import Shear from './Transformations/Shear';
import VecpadMesh from './VecpadMesh';


export default function(label, updateSceneFunc) {
	this.name = label;
	this.matrixAutoUpdate = false;
	this.originalMatrix = this.matrix.clone();
	this.transformations = [];
	this.currentStep = 1;
	this.currentCallbackId = 0;
	this.callbacks = []
	this.intervalId = null;

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
		let y = this instanceof VecpadMesh ?
			Math.max(...worldPositions.map((elem) => elem.y)) :
			average(worldPositions.map((elem) => elem.y));
		let z = average(worldPositions.map((elem) => elem.z));

		let translationToPos = new THREE.Matrix4().makeTranslation(x, y + 0.1, z);
		this.label.matrix.copy(new THREE.Matrix4());
		this.label.applyMatrix(new THREE.Matrix4().getInverse(this.matrix, false).multiply(translationToPos));
	}

	let objectLabel = ObjectHelper.createLabel(this.name);
	objectLabel.matrixAutoUpdate = false;
	this.label = objectLabel;
	this.add(this.label);
	this.updateScene = updateSceneFunc;
	this.computeLabelPosition();

	this.registerCallback = (func) => {
		let id = this.currentCallbackId++;
		this.callbacks.push({
			id,
			func
		});
		return id;
	}

	this.unregisterCallback = (id) => {
		this.callbacks = this.callbacks.filter((callback) => callback.id !== id);
	}

	this.notifyRegistreeOfDeletion = () => {
		this.callbacks.forEach(({func}) => {
			func(this, true);
		});
	}

	this.updateTransformationList = () => this.updateScene(false, [{
		uuid: this.uuid,
		valueName: 'transformations',
		value: this.transformations.reduce(
			(trans, currentTrans) => {
				trans.push(currentTrans.toJSON());
				return trans;
			},
			[]
		)
	}]);

	this.applyTransformations = (step) => {
		this.currentStep = step;

		let stepPerTrans = 1 / (this.transformations.length);
		let currentTrans = Math.floor(step / stepPerTrans);
		let stepInCurrentTrans = (step * this.transformations.length) - currentTrans;

		this.transformations.forEach((trans, i) => {
			if (i < currentTrans) {
				trans.step = 1;
			} else if (i > currentTrans) {
				trans.step = 0;
			} else {
				trans.step = stepInCurrentTrans;
			}
		});

		this.computeTransformations();

		this.callbacks.forEach(({func}) => func(this, false));

		this.updateScene();
	}

	this.addTransformation = (transformation) => {
		this.transformations.push(transformation);
		this.applyTransformations(1);
		this.updateScene(false, [{
			uuid: this.uuid,
			valueName: 'transformations',
			value: this.transformations.reduce(
				(trans, currentTrans) => {
					trans.push(currentTrans.toJSON());
					return trans;
				},
				[]
			)
		}]);
	}

	this.addScale = (scale=new Scale(1, 1, 1)) => {
		this.addTransformation(scale);
	}

	this.addShear = (shear=new Shear(0, 0, 0, 0, 0, 0)) => {
		this.addTransformation(shear);
	}

	this.addRotation = (rotation=new Rotation(new THREE.Vector3(), 0)) => {
		this.addTransformation(rotation);
	}

	this.removeTransformation = (transformation) => {
		this.transformations = this.transformations.filter((trans) => trans !== transformation);
		this.applyTransformations(1);
		this.updateTransformationList();
	}

	this.swapTransformations = (i, j) => {
		[this.transformations[i], this.transformations[j]] = [this.transformations[j], this.transformations[i]];
		this.applyTransformations(1);
		this.updateTransformationList();
	}

	this.updateLabel = (text) => {
		this.label.element.textContent = text;
		this.name = text;
		this.updateScene(true, [{
			uuid: this.uuid,
			valueName: 'name',
			value: this.name
		}]);
	}

	this.play = () => {
		this.pause();

		const deltaTime = 1 / (60 * (this.transformations.length || 1));
		this.currentStep = this.currentStep === 1 ? 0 : this.currentStep;
		this.intervalId = setInterval(() => {
			this.applyTransformations(this.currentStep + deltaTime);
			if (this.currentStep >= 1) {
				this.currentStep = 1;
				clearInterval(this.intervalId);
			}
		}, deltaTime * 1000);
	}

	this.pause = () => {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	}

	this.addTransformation = (transformation) => {
		this.transformations.push(transformation);
		this.applyTransformations(1);
		this.updateScene(false, [{
			uuid: this.uuid,
			valueName: 'transformations',
			value: this.transformations.reduce(
				(trans, currentTrans) => {
					trans.push(currentTrans.toJSON());
					return trans;
				},
				[]
			)
		}]);
	}

	this.addScale = (scale=new Scale(1, 1, 1, this)) => {
		this.addTransformation(scale);
	}

	this.addShear = (shear=new Shear(0, 0, 0, 0, 0, 0, this)) => {
		this.addTransformation(shear);
	}

	this.addRotation = (rotation=new Rotation(new THREE.Vector3(), 0, this)) => {
		this.addTransformation(rotation);
	}
};