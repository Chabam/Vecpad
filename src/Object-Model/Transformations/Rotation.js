import React from 'react';
import Transformation from "./Transformation";
import * as THREE from 'three';
import InputGroup from '../../Components/Inputs/InputGroup';
import CoordinatesPicker from '../../Components/Inputs/CoordinatesPicker';

export default class Rotation extends Transformation {
	constructor(axis, angle, object) {
		super(object);
		this.name = 'Rotation';
		this.axis = axis;
		this.angle = angle;
	}

	getMatrix = () => new THREE.Matrix4().makeRotationAxis(
		this.axis,
		THREE.Math.degToRad(this.angle) * this.step
	);

	toJSON = () => {
		return {
			name: this.name,
			axis: {
				x: this.axis.x,
				y: this.axis.y,
				z: this.axis.z
			},
			angle: this.angle
		}
	}

	getControls = () => {
		const updateAngle = (event) => this.updateTransformationValue(
			'angle',
			parseFloat(event.target.value)
		);

		return (
			<React.Fragment>
				<CoordinatesPicker
					name="Axis"
					updateCoordinates={(axis) => this.updateTransformationValue('axis', axis)}
					coordinates={this.axis}
				/>
				<InputGroup name="Angle">
					<input type="number" step={0.01} defaultValue={this.angle} onChange={updateAngle}/>
				</InputGroup>
			</React.Fragment>
		)

	}
}