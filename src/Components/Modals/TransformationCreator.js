import React, {Component} from 'react';
import CoordinatesPicker from '../Inputs/CoordinatesPicker';
import InputGroup from '../Inputs/InputGroup';
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
						{
							this.object.type !== 'Vector' &&
							<option value={TransformationCreator.TransformationType.Translation}>
								Translation
							</option>
						}
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
						<InputGroup name="Amount of X moved by Y" id="amount-xy">
							<input name="amount-xy" type="number" step={0.01} defaultValue={0} required/>
						</InputGroup>
						<InputGroup name="Amount of X moved by Z" id="amount-xz">
							<input name="amount-xz" type="number" step={0.01} defaultValue={0} required/>
						</InputGroup>
						<InputGroup name="Amount of Y moved by X" id="amount-yx">
							<input name="amount-yx" type="number" step={0.01} defaultValue={0} required/>
						</InputGroup>
						<InputGroup name="Amount of Y moved by Z" id="amount-yz">
							<input name="amount-yz" type="number" step={0.01} defaultValue={0} required/>
						</InputGroup>
						<InputGroup name="Amount of Z moved by X" id="amount-zx">
							<input name="amount-zx" type="number" step={0.01} defaultValue={0} required/>
						</InputGroup>
						<InputGroup name="Amount of Z moved by Y" id="amount-zy">
							<input name="amount-zy" type="number" step={0.01} defaultValue={0} required/>
						</InputGroup>
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
							<input name="angle" type="number" step={0.01} defaultValue={0} required/>
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
			parseFloat(data.get('amount-xy')),
			parseFloat(data.get('amount-xz')),
			parseFloat(data.get('amount-yx')),
			parseFloat(data.get('amount-yz')),
			parseFloat(data.get('amount-zx')),
			parseFloat(data.get('amount-zy'))
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