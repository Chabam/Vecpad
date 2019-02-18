import React, {Component} from 'react';
import CoordinatesPicker from './CoordinatesPicker';
import InputGroup from './InputGroup';
import * as THREE from 'three';

export default class TransformationCreator extends Component {

	static TransformationType = {
		Translation: 0,
		Scale: 1,
		Shear: 2,
		Rotation: 3
	}

	constructor(props) {
		super(props);
		this.state = {
			transformationType: null
		}
		this.object = props.object;
		this.closeModal = props.closeModal;
	}

	render() {
		let { transformationType } = this.state;

		return (
			<div>
				<InputGroup name="Transformation type" id="Transformation-type">
					<select onChange={this.changeTransformationType}>
						<option></option>
						<option value={TransformationCreator.TransformationType.Translation}>
							Translation
						</option>
						<option value={TransformationCreator.TransformationType.Scale}>
							Scale
						</option>
						<option value={TransformationCreator.TransformationType.Shear}>
							Shear
						</option>
						<option value={TransformationCreator.TransformationType.Rotation}>
							Rotation
						</option>
					</select>
				</InputGroup>
				{this.renderTransformationForm(transformationType)}
			</div>
		);
	}

	changeTransformationType = (event) => this.setState({
		transformationType: parseInt(event.target.value)
	});

	renderTransformationForm = (transformationType) => {
		switch(transformationType) {
			case TransformationCreator.TransformationType.Translation:
				return (
					<form onSubmit={this.createTranslation}>
						<CoordinatesPicker name="Amount" defaultX={0} defaultY={0} defaultZ={0}/>
						<button type="submit">Add</button>
					</form>
				);
			case TransformationCreator.TransformationType.Shear:
				return (
					<form onSubmit={this.createShear}>
						<CoordinatesPicker name="Amount" defaultX={0} defaultY={0} defaultZ={0}/>
						<button type="submit">Add</button>
					</form>
				);
			case TransformationCreator.TransformationType.Scale:
				return (
					<form onSubmit={this.createScale}>
						<CoordinatesPicker name="Amount" defaultX={1} defaultY={1} defaultZ={1}/>
						<button type="submit">Add</button>
					</form>
				);
			case TransformationCreator.TransformationType.Rotation:
				return (
					<form onSubmit={this.createRotation}>
						<CoordinatesPicker name="Axis" defaultX={0} defaultY={0} defaultZ={0}/>
						<small>* Note that the axis will be normalized</small>
						<InputGroup name="Angle" id="angle">
							<input name="angle" type="number" step={0.01} required/>
						</InputGroup>
						<small>* Note that the angle is in radian</small>
						<button type="submit">Add</button>
					</form>
				);
			default:
				return (<div>No type selected!</div>);
		}
	}

	createTranslation = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);

		this.object.addTranslation(
			parseFloat(data.get('amount-x')),
			parseFloat(data.get('amount-y')),
			parseFloat(data.get('amount-z'))
		);
		this.closeModal();
	}

	createScale = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);

		this.object.addScale(
			parseFloat(data.get('amount-x')),
			parseFloat(data.get('amount-y')),
			parseFloat(data.get('amount-z'))
		);
		this.closeModal();
	}


	createShear = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);

		this.object.addShear(
			parseFloat(data.get('amount-x')),
			parseFloat(data.get('amount-y')),
			parseFloat(data.get('amount-z'))
		);
		this.closeModal();
	}

	createRotation = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);
		let axis = new THREE.Vector3(
			parseFloat(data.get('axis-x')),
			parseFloat(data.get('axis-y')),
			parseFloat(data.get('axis-z'))
		).normalize();
		this.object.addRotation(axis, parseFloat(data.get('angle')));
		this.closeModal();
	}
}