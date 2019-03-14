import * as THREE from 'three';
import ObjectHelper from './THREE/ObjectHelper';
import Scale from './Transformations/Scale';
import Rotation from './Transformations/Rotation';
import Shear from './Transformations/Shear';
import VecpadMesh from './VecpadMesh';


export default function(label, reactUpdateFunc) {
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
	this.updateReact = reactUpdateFunc;
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

	this.notifyRegistree = () => {
		this.callbacks.forEach(({func}) => {
			func(this, true);
		});
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

		transformation.updateReact = this.updateReact;
		transformation.applyTransformations = this.applyTransformations;

		this.transformations.push(transformation);
		this.applyTransformations(1);
	}

	this.addScale = () => {
		this.addTransformation(new Scale(1, 1, 1));
	}

	this.addShear = () => {
		this.addTransformation(new Shear(0, 0, 0, 0, 0, 0));
	}

	this.addRotation = () => {
		this.addTransformation(new Rotation(new THREE.Vector3(), 0));
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
		this.label.element.textContent = text;
		this.name = text;
		this.updateReact();
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
};