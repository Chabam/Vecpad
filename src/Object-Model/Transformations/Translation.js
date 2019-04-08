import React from 'react';
import InputGroup from '../../Components/Inputs/InputGroup';
import Transformation from './Transformation';
import * as THREE from 'three';

export default class Translation extends Transformation {
	constructor(x, y, z, object) {
		super(object);
		this.name = 'Translation';
		this.x = x;
		this.y = y;
		this.z = z;
	}

	getMatrix = () => new THREE.Matrix4().makeTranslation(
		this.x * this.step,
		this.y * this.step,
		this.z * this.step,
	);

	toJSON = () => {
		return {
			name: this.name,
			x: this.x,
			y: this.y,
			z: this.z
		};
	}

	getControls = () => {
		const updateX = (event) => this.updateTransformationValue('x', parseFloat(event.target.value));
		const updateY = (event) => this.updateTransformationValue('y', parseFloat(event.target.value));
		const updateZ = (event) => this.updateTransformationValue('z', parseFloat(event.target.value));

		return (
			<React.Fragment>
				<InputGroup name="Amount X">
					<input type="number" step={0.01} defaultValue={this.x} onChange={updateX}/>
				</InputGroup>
				<InputGroup name="Amount Y">
					<input type="number" step={0.01} defaultValue={this.y} onChange={updateY}/>
				</InputGroup>
				<InputGroup name="Amount Z">
					<input type="number" step={0.01} defaultValue={this.z} onChange={updateZ}/>
				</InputGroup>
			</React.Fragment>
		);
	}
}