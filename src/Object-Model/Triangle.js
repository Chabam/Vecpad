import React from 'react';
import VecpadMesh from './VecpadMesh';
import ObjectHelper from './THREE/ObjectHelper';
import InputGroup from '../Components/Inputs/InputGroup';

export default class Triangle extends VecpadMesh {
	constructor(width, displayMode, color, outlineColor, label, updateSceneFunc) {
		super(
			ObjectHelper.createTriangleGeometry(width),
			'Triangle',
			displayMode,
			color,
			outlineColor,
			label,
			updateSceneFunc
		);
	}

	getTypeSpecificControls = () => {
		let { width } = this.geometry.parameters;
		const updateTriangleGeometry = (event) => {
			this.updateGeometry(ObjectHelper.createTriangleGeometry(parseFloat(event.target.value)));
		}

		return (
			<React.Fragment>
				<InputGroup name="Width">
					<input type="number" step={0.01} defaultValue={width} onChange={updateTriangleGeometry}/>
				</InputGroup>
			</React.Fragment>
		);
	}

	toJSON = () => {
		return {
			uuid: this.uuid,
			name: this.name,
			width: this.geometry.parameters.width,
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