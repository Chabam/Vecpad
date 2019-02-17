import React, {Component} from 'react';
import CoordinatesPicker from './CoordinatesPicker';
import ColorPicker from './ColorPicker';
import InputGroup from './InputGroup';
import * as THREE from 'three';

export default class ObjectCreator extends Component {

	static ObjectType = {
		Vector: 0,
		Triangle: 1,
		Quad: 2,
		Cube: 3,
	}

	constructor(props) {
		super(props);
		this.state = {
			ObjectType: null
		}
		this.sceneHelper = props.sceneHelper;
		this.closeModal = props.closeModal;
	}

	render() {
		let { objectType } = this.state;

		return (
			<div>
				<InputGroup name="Object type" id="object-type">
					<select onChange={this.changeObjectType}>
						<option></option>
						<option value={ObjectCreator.ObjectType.Vector}>
							Vector
						</option>
						<option value={ObjectCreator.ObjectType.Triangle}>
							Triangle
						</option>
						<option value={ObjectCreator.ObjectType.Quad}>
							Quad
						</option>
						<option value={ObjectCreator.ObjectType.Cube}>
							Cube
						</option>
					</select>
				</InputGroup>
				{this.renderObjectForm(objectType)}
			</div>
		);
	}

	changeObjectType = (event) => this.setState({
		objectType: parseInt(event.target.value)
	});

	renderObjectForm = (objectType) => {
		const name =
			<InputGroup name="Name" id="name">
				<input type="text" name="name" placeholder="The object's name"></input>
			</InputGroup>
		switch(objectType) {
			case ObjectCreator.ObjectType.Vector:
				return (
					<form onSubmit={this.createVector}>
						{name}
						<CoordinatesPicker name="Origin"></CoordinatesPicker>
						<CoordinatesPicker name="Direction" defaultX={1} defaultY={1} defaultZ={1}></CoordinatesPicker>
						<small>* Note that the direction will be normalized</small>
						<InputGroup name="Magnitude" id="magnitude">
							<input required name="magnitude" type="number" defaultValue={1} step={0.01}></input>
						</InputGroup>
						<ColorPicker name="Color"></ColorPicker>
						<button type="submit">Add</button>
					</form>
				);
			case ObjectCreator.ObjectType.Triangle:
			return (
				<form onSubmit={this.createTriangle}>
					{name}
					<CoordinatesPicker name="Origin"></CoordinatesPicker>
					<InputGroup name="Width" id="width">
						<input required name="width" type="number" defaultValue={1} step={0.01}></input>
					</InputGroup>
					<ColorPicker name="Fill Color" defaultColor={0xffffff}></ColorPicker>
					<ColorPicker name="Outline Color"></ColorPicker>
					<button type="submit">Add</button>
				</form>
			);
			case ObjectCreator.ObjectType.Quad:
			return (
				<form onSubmit={this.createQuad}>
					{name}
					<CoordinatesPicker name="Origin"></CoordinatesPicker>
					<InputGroup name="Width" id="width">
						<input required name="width" type="number" defaultValue={1} step={0.01}></input>
					</InputGroup>
					<InputGroup name="Height" id="height">
						<input required name="height" type="number" defaultValue={1} step={0.01}></input>
					</InputGroup>
					<ColorPicker name="Fill Color" defaultColor={0xffffff}></ColorPicker>
					<ColorPicker name="Outline Color"></ColorPicker>
					<button type="submit">Add</button>
				</form>
			);
			case ObjectCreator.ObjectType.Cube:
			return (
				<form onSubmit={this.createCube}>
					{name}
					<CoordinatesPicker name="Origin"></CoordinatesPicker>
					<InputGroup name="Width" id="width">
						<input required name="width" type="number" defaultValue={1} step={0.01}></input>
					</InputGroup>
					<InputGroup name="Height" id="height">
						<input required name="height" type="number" defaultValue={1} step={0.01}></input>
					</InputGroup>
					<InputGroup name="Depth" id="depth">
						<input required name="depth" type="number" defaultValue={1} step={0.01}></input>
					</InputGroup>
					<ColorPicker name="Fill Color" defaultColor={0xffffff}></ColorPicker>
					<ColorPicker name="Outline Color"></ColorPicker>
					<button type="submit">Add</button>
				</form>
			);
			default:
				return (<div>No type selected!</div>);
		}
	}

	createVector = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);
		let name = data.get('name');
		let origin = new THREE.Vector3(
			parseFloat(data.get('origin-x')),
			parseFloat(data.get('origin-y')),
			parseFloat(data.get('origin-z'))
		);
		let direction = new THREE.Vector3(
			parseFloat(data.get('direction-x')),
			parseFloat(data.get('direction-y')),
			parseFloat(data.get('direction-z'))
		).normalize();
		let magnitude = parseFloat(data.get('magnitude'));
		let color = parseInt(data.get('color'));
		this.sceneHelper.addVector(origin, direction, magnitude, color, name);
		this.closeModal();
	}

	createTriangle = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);
		let name = data.get('name');
		let origin = new THREE.Vector3(
			parseFloat(data.get('origin-x')),
			parseFloat(data.get('origin-y')),
			parseFloat(data.get('origin-z'))
		);
		let width = parseFloat(data.get('width'));
		let outlineColor = parseInt(data.get('outline-color'));
		let fillColor = parseInt(data.get('fill-color'));
		this.sceneHelper.addTriangle(origin, width, fillColor, outlineColor, name);
		this.closeModal();
	}

	createQuad = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);
		let name = data.get('name');
		let origin = new THREE.Vector3(
			parseFloat(data.get('origin-x')),
			parseFloat(data.get('origin-y')),
			parseFloat(data.get('origin-z'))
		);
		let width = parseFloat(data.get('width'));
		let height = parseFloat(data.get('height'));
		let outlineColor = parseInt(data.get('outline-color'));
		let fillColor = parseInt(data.get('fill-color'));
		this.sceneHelper.addQuad(origin, width, height, fillColor, outlineColor, name);
		this.closeModal();
	}

	createCube = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);
		let name = data.get('name');
		let origin = new THREE.Vector3(
			parseFloat(data.get('origin-x')),
			parseFloat(data.get('origin-y')),
			parseFloat(data.get('origin-z'))
		);
		let width = parseFloat(data.get('width'));
		let height = parseFloat(data.get('height'));
		let depth = parseFloat(data.get('depth'));
		let outlineColor = parseInt(data.get('outline-color'));
		let fillColor = parseInt(data.get('fill-color'));
		this.sceneHelper.addCube(origin, width, height, depth, fillColor, outlineColor, name);
		this.closeModal();
	}

}