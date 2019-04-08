import React from 'react';
import InputGroup from '../../Components/Inputs/InputGroup';
import Transformation from './Transformation';
import * as THREE from 'three';

export default class Scale extends Transformation {
	constructor(x, y, z, object) {
		super(object);
		this.name = 'Scale';
		this.x = x;
		this.y = y;
		this.z = z;
	}

	getMatrix = () => {
		return new THREE.Matrix4().makeScale(
			(1 + (this.x - 1) * this.step) || 0.00000001,
			(1 + (this.y - 1) * this.step) || 0.00000001,
			(1 + (this.z - 1) * this.step) || 0.00000001
		);
	}

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