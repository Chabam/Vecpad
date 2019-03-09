import React from 'react';
import InputGroup from '../Inputs/InputGroup';
import CoordinatesPicker from '../Inputs/CoordinatesPicker';
import ColorPicker from '../Inputs/ColorPicker';
import VecpadMesh from '../../Object-Model/VecpadMesh';

// This component will show the specific details of the currently selected object
const SelectionEditor = ({object, sceneHelper, cameraHelper}) => {
	// let worldPositions = object.geometry.vertices.map((vertex, i) => {
	// 	let position = vertex.clone().applyMatrix4(object.matrixWorld);
	// 	let {x, y, z} = position;
	// 	return <li key={i}>X: {THREEHelper.displayFloat(x)} Y: {THREEHelper.displayFloat(y)} Z: {THREEHelper.displayFloat(z)}</li>;
	// });

	const followObject = (e) => {
		if (e.target.checked) {
			cameraHelper.focusObject(object);
		} else {
			cameraHelper.unfocusObject();
		}
	}

	let objectIsFocused = cameraHelper.focusedObject !== null && cameraHelper.focusedObject.object === object;

	let coordinatesEditor;
	if (object instanceof VecpadMesh) {
		coordinatesEditor = (
			<CoordinatesPicker
				name="Position"
				coordinates={object.originalPosition}
				updateCoordinates={object.updatePosition}
			/>
		);
	} else if (object.type === 'Vector') {
		coordinatesEditor = (
			<CoordinatesPicker
				name="Direction"
				coordinates={object.originalVector}
				updateCoordinates={object.updateDirection}
			/>
		);
	}

	let typeSpecificControls;

	switch(object.type) {
		case 'Operation':
			let vectors = sceneHelper.getVectors().map((vector, i) => (
				<option key={i} value={vector.id}>{vector.name}</option>
			));
			const updateV1 = (event) => object.setV1(
				sceneHelper.THREEScene.getObjectById(parseInt(event.target.value))
			);
			const updateV2 = (event) => object.setV2(
				sceneHelper.THREEScene.getObjectById(parseInt(event.target.value))
			);
			typeSpecificControls = (
				<div className="typeSpecficControls">
					<InputGroup name="Vector 1">
						<select onChange={updateV1} defaultValue={object.v1 ? object.v1.id : -1}>
							<option value={-1}></option>
							{vectors}
						</select>
					</InputGroup>
					<InputGroup name="Vector 2">
						<select onChange={updateV2} defaultValue={object.v2 ? object.v2.id : -1}>
							<option value={-1}></option>
							{vectors}
						</select>
					</InputGroup>
				</div>
			);
			break;
		default:
			typeSpecificControls = (<div>No type</div>);
			break;

	}
	return (
		<div id="selection-editor">
			<h1>{`${object.type}: ${object.name}`}</h1>
			<InputGroup name="Follow">
				<input onChange={followObject} type="checkbox" checked={objectIsFocused}/>
			</InputGroup>
			<InputGroup name="Label">
				<input
					type="text"
					value={object.name}
					onChange={(event) => object.updateLabel(event.target.value)}
				/>
			</InputGroup>
			<ColorPicker
				name="Color"
				updateColor={object.updateColor}
				defaultColor={object.color}
			/>
			{
				object.type instanceof VecpadMesh &&
				<ColorPicker
					name="Outline color"
					updateColor={object.updateOutlineColor}
					defaultColor={object.outlineColor}
				/>
			}
			{coordinatesEditor}
			{typeSpecificControls}
		</div>
	);
}

export default SelectionEditor;