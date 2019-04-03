import React from 'react';
import Transformation from "./Transformation";
import * as THREE from 'three';
import InputGroup from '../../Components/Inputs/InputGroup';

export default class Shear extends Transformation {
	constructor(xY, xZ, yX, yZ, zX, zY) {
		super();
		this.name = 'Shear';
		this.xY = xY;
		this.xZ = xZ;
		this.yX = yX;
		this.yZ = yZ;
		this.zX = zX;
		this.zY = zY;
	}

	getMatrix = () => {
		let { xY, xZ, yX, yZ, zX, zY } = this;
		let amountXY = xY * this.step;
		let amountXZ = xZ * this.step;
		let amountYX = yX * this.step;
		let amountYZ = yZ * this.step;
		let amountZX = zX * this.step;
		let amountZY = zY * this.step;
		return new THREE.Matrix4().set(
			1, amountXY, amountXZ, 0,
			amountYX, 1, amountYZ, 0,
			amountZX, amountZY, 1, 0,
			0,        0,        0, 1
		);
	}

	toJSON = () => {
		return {
			name: this.name,
			xY: this.xY,
			xZ: this.xZ,
			yX: this.yX,
			yZ: this.yZ,
			zX: this.zX,
			zY: this.zY
		}
	}

	getControls = () => {
		const updateXY = (event) => this.updateTransformationValue('xY', parseFloat(event.target.value));
		const updateXZ = (event) => this.updateTransformationValue('xZ', parseFloat(event.target.value));
		const updateYX = (event) => this.updateTransformationValue('yX', parseFloat(event.target.value));
		const updateYZ = (event) => this.updateTransformationValue('yZ', parseFloat(event.target.value));
		const updateZX = (event) => this.updateTransformationValue('zX', parseFloat(event.target.value));
		const updateZY = (event) => this.updateTransformationValue('zY', parseFloat(event.target.value));

		return (
			<React.Fragment>
				<InputGroup name="Amount XY">
					<input type="number" step={0.01} defaultValue={this.xY} onChange={updateXY}/>
				</InputGroup>
				<InputGroup name="Amount XZ">
					<input type="number" step={0.01} defaultValue={this.xZ} onChange={updateXZ}/>
				</InputGroup>
				<InputGroup name="Amount YX">
					<input type="number" step={0.01} defaultValue={this.yX} onChange={updateYX}/>
				</InputGroup>
				<InputGroup name="Amount YZ">
					<input type="number" step={0.01} defaultValue={this.yZ} onChange={updateYZ}/>
				</InputGroup>
				<InputGroup name="Amount ZX">
					<input type="number" step={0.01} defaultValue={this.zX} onChange={updateZX}/>
				</InputGroup>
				<InputGroup name="Amount ZY">
					<input type="number" step={0.01} defaultValue={this.zY} onChange={updateZY}/>
				</InputGroup>
			</React.Fragment>
		);
	}
}