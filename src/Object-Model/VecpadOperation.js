import React from 'react';
import * as THREE from 'three';
import VecpadVector from './VecpadVector';
import InputGroup from '../Components/Inputs/InputGroup';

// A general class to represent all vector operations
export default class VecpadOperation extends VecpadVector {
	constructor(operation, color, label, reactUpdateFunc) {
		super(new THREE.Vector3(), color, label, reactUpdateFunc);
		this.type = 'Operation';

		this.operation = operation;
		this.v1 = null;
		this.v2 = null;
		this.v1CbId = null;
		this.v2CbId = null;

		this.label.element.classList.add('hidden');
	}

	setV1 = (vector) => {
		this.setVectors(vector, this.v2);
	}

	setV2 = (vector) => {
		this.setVectors(this.v1, vector);
	}

	setVectors = (v1, v2) => {
		// If the vector changed
		if (v1 !== this.v1) {
			// and another one existed before
			if (this.v1) {
				// We unregister from its changes
				this.v1.unregisterCallback(this.v1CbId);
			}

			this.v1 = v1;
			this.v1CbId = this.v1 ? this.v1.registerCallback(this.updateVectors) : null;

			this.updateScene(true, [{
				uuid: this.uuid,
				valueName: 'v1',
				value: this.v1 ? this.v1.uuid : null
			}]);
		}

		if (v2 !== this.v2) {
			if (this.v2) {
				this.v2.unregisterCallback(this.v2CbId);
			}

			this.v2 = v2;
			this.v2CbId = this.v2 ? this.v2.registerCallback(this.updateVectors) : null;

			this.updateScene(true, [{
				uuid: this.uuid,
				valueName: 'v2',
				value: this.v2 ? this.v2.uuid : null
			}]);
		}

		// If both vectors are there, render the operation
		if (this.v1 && this.v2) {
			this.showOperation();
		} else {
			this.hideOperation();
		}
	}

	showOperation = () => {
		this.label.element.classList.remove('hidden');
		this.originalVector = this.operation(this.v1.vector, this.v2.vector);

		this.applyTransformations(1);
	}

	hideOperation = () => {
		this.label.element.classList.add('hidden');
		this.originalVector = new THREE.Vector3(0, 0, 0);

		this.applyTransformations(1);
	}

	// The function called when one of the vector changed
	updateVectors = (changedObject, deleted) => {
		if (this.v1 && changedObject.uuid === this.v1.uuid) {
			this.setV1(deleted ? null : changedObject);
		} else if (this.v2 && changedObject.uuid === this.v2.uuid) {
			this.setV2(deleted ? null : changedObject);
		}
	}

	getCoordinatesEditor = () => (<React.Fragment/>);

	getTypeSpecificControls = (sceneHelper) => {
		let availableVectors = sceneHelper.getVectors();
		let v1s = availableVectors.map((vector, i) => (
			<option key={i} value={vector.id}>{vector.name}</option>
		));
		let v2s = availableVectors.map((vector, i) => (
			<option key={i} value={vector.id}>{vector.name}</option>
		));

		const updateV1 = (event) => this.setV1(
			sceneHelper.THREEScene.getObjectById(parseInt(event.target.value)) || null
		);
		const updateV2 = (event) => this.setV2(
			sceneHelper.THREEScene.getObjectById(parseInt(event.target.value)) || null
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
