import React from 'react';
import * as THREE from 'three';
import VecpadVector from './VecpadVector';
import InputGroup from '../Components/Inputs/InputGroup';

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

	updateVectors = (changedObject, deleted) => {

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
		this.updateVector(this.operation(this.v1.vector, this.v2.vector));
	}

	removeOperation = () => {
		this.label.element.classList.add('hidden');
		this.updateVector(new THREE.Vector3());
	}

	getTypeSpecificControls = (sceneHelper) => {
		let availableVectors = sceneHelper.getVectors();
		let v1s = availableVectors.map((vector, i) => (
			<option key={i} value={vector.id}>{vector.name}</option>
		));
		let v2s = availableVectors.map((vector, i) => (
			<option key={i} value={vector.id}>{vector.name}</option>
		));

		const updateV1 = (event) => this.setV1(
			sceneHelper.THREEScene.getObjectById(parseInt(event.target.value))
		);
		const updateV2 = (event) => this.setV2(
			sceneHelper.THREEScene.getObjectById(parseInt(event.target.value))
		);

		return (
			<React.Fragment>
				<InputGroup name="Vector 1">
					<select onChange={updateV1} value={this.v1 ? this.v1.id : -1}>
						<option value={-1}></option>
						{v1s}
					</select>
				</InputGroup>
				<InputGroup name="Vector 2">
					<select onChange={updateV2} value={this.v2 ? this.v2.id : -1}>
						<option value={-1}></option>
						{v2s}
					</select>
				</InputGroup>
			</React.Fragment>
		);
	}
}
