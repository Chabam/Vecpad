import React from 'react';
import * as THREE from 'three';
import VecpadMesh from './VecpadMesh';
import InputGroup from '../Components/Inputs/InputGroup';

export default class Cube extends VecpadMesh {
	constructor(width, height, depth, displayMode, color, outlineColor, label, updateSceneFunc) {
		super(
			new THREE.BoxGeometry(width, height, depth),
			'Cube',
			displayMode,
			color,
			outlineColor,
			label,
			updateSceneFunc
		);
	}

	getTypeSpecificControls = () => {
		let { width, height, depth } = this.geometry.parameters;
		const updateQuadGeometry = (width, height, depth) => {
			this.updateGeometry(new THREE.BoxGeometry(width, height, depth));
		}

		const updateWidth = (event) => updateQuadGeometry(parseFloat(event.target.value), height, depth);
		const updateHeight = (event) => updateQuadGeometry(width, parseFloat(event.target.value), depth);
		const updateDepth = (event) => updateQuadGeometry(width, height, parseFloat(event.target.value));

		return (
			<React.Fragment>
				<InputGroup name="Width">
					<input type="number" step={0.01} defaultValue={width} onChange={updateWidth}/>
				</InputGroup>
				<InputGroup name="Height">
					<input type="number" step={0.01} defaultValue={height} onChange={updateHeight}/>
				</InputGroup>
				<InputGroup name="Depth">
					<input type="number" step={0.01} defaultValue={depth} onChange={updateDepth}/>
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
			depth: this.geometry.parameters.depth,
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
		}
	}
}