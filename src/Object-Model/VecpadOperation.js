import * as THREE from 'three';
import VecpadVector from './VecpadVector';

export default class VecpadOperation extends VecpadVector {
	constructor(operation, label, reactUpdateFunc) {
		super(new THREE.Vector3(), 0x000000, label, reactUpdateFunc);
		this.type = 'Operation';

		this.operation = operation;
		this.v1 = null;
		this.v2 = null;
		this.v1CbId = null;
		this.v2CbId = null;

		this.label.element.classList.add('hidden');
	}

	setV1 = (vector) => {
		if (this.v1) {
			this.v1.unregisterCallback(this.v1CbId);
		}

		if (typeof vector !== 'undefined') {
			this.v1 = vector;
			this.v1CbId = this.v1.registerCallback(this.updateVectors);

			if (this.v2) {
				this.createOperation();
			}
		} else {
			this.v1 = null;
			this.v1CbId = null;
			this.removeOperation();
		}

		this.updateReact();
	}

	setV2 = (vector) => {
		if (this.v2) {
			this.v2.unregisterCallback(this.v2CbId);
		}

		if (typeof vector !== 'undefined') {
			this.v2 = vector;
			this.v2CbId = this.v2.registerCallback(this.updateVectors);

			if (this.v1) {
				this.createOperation();
			}
		} else {
			this.v2 = null;
			this.v2CbId = null;
			this.removeOperation();
		}

		this.updateReact();
	}

	updateVectors = ({ changedObject, deleted }) => {

		if (deleted) {
			if (!this.v1 || !this.v2) {
				this.v1 = this.v2 = null;
				this.v1CbId = this.v2CbId = null;
				this.updateReact();
				return;
			} else if (changedObject.uuid === this.v1.uuid) {
				this.v1 = null;
				this.v1CbId = null;
			} else {
				this.v2 = null;
				this.v2CbId = null;
			}
			this.removeOperation();
		} else {
			this.createOperation();
		}

		this.updateReact();
	}

	createOperation = () => {
		this.label.element.classList.remove('hidden');
		this.updateDirection(this.operation(this.v1.vector, this.v2.vector));
	}

	removeOperation = () => {
		this.label.element.classList.add('hidden');
		this.updateDirection(new THREE.Vector3());
	}
}
