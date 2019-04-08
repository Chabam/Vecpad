import React from 'react';
import * as THREE from 'three';
import VecpadMesh from './VecpadMesh';
import InputGroup from '../Components/Inputs/InputGroup';

export default class Quad extends VecpadMesh {
	constructor(width, height, displayMode, color, outlineColor, label, updateSceneFunc) {
		super(
			new THREE.PlaneGeometry(width, height),
			'Quad',
			displayMode,
			color,
			outlineColor,
			label,
			updateSceneFunc
		);
	}

	getTypeSpecificControls = () => {
		let { width, height } = this.geometry.parameters;
		const updateQuadGeometry = (width, height) => {
			this.updateGeometry(new THREE.PlaneGeometry(width, height));
		};

		const updateWidth = (event) => updateQuadGeometry(parseFloat(event.target.value), height);
		const updateHeight = (event) => updateQuadGeometry(width, parseFloat(event.target.value));

		return (
			<React.Fragment>
				<InputGroup name="Width">
					<input type="number" step={0.01} defaultValue={width} onChange={updateWidth}/>
				</InputGroup>
				<InputGroup name="Height">
					<input type="number" step={0.01} defaultValue={height} onChange={updateHeight}/>
				</InputGroup>
			</React.Fragment>
		);
	}

	toJSON = () => {
		return {
			uuid: this.uuid,
			name: this.name,
			width: this.geometry.parameters.width,
			height: this.geometry.parameters.height,
			type: this.type,
			color: this.material.color.getHex(),
			outlineColor: this.outline.material.color.getHex(),
			originalPosition: this.originalPosition,
			originalMatrix: this.originalMatrix,
			transformations: this.transformations.reduce(
				(trans, currentTrans) => {
					trans.push(currentTrans.toJSON());
					return trans;
				},
				[]
			)
		};
	}
}