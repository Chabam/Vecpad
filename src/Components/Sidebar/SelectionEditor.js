import React from 'react';
import InputGroup from '../Inputs/InputGroup';
import CoordinatesPicker from '../Inputs/CoordinatesPicker';
import ColorPicker from '../Inputs/ColorPicker';

// This component will show the specific details of the currently selected object
const SelectionEditor = ({object, cameraHelper}) => {
	// let worldPositions = object.geometry.vertices.map((vertex, i) => {
	// 	let position = vertex.clone().applyMatrix4(object.matrixWorld);
	// 	let {x, y, z} = position;
	// 	return <li key={i}>X: {THREEHelper.displayFloat(x)} Y: {THREEHelper.displayFloat(y)} Z: {THREEHelper.displayFloat(z)}</li>;
	// });
	const followObject = (e) => {
		if (e.target.checked) {
			cameraHelper.focusObject(object);
		} else {
			cameraHelper.reset();
			cameraHelper.unfocusObject();
		}
	}
	let objectIsFocused = cameraHelper.focusedObject !== null && cameraHelper.focusedObject.object === object;
	let coordinateEditor = object.type !== 'Vector' ?
	(
		<CoordinatesPicker
					name="Position"
					coordinates={object.position}
					updateCoordinates={object.updatePosition}
		/>
	):(
		<CoordinatesPicker
					name="Position"
					coordinates={object.vector}
					updateCoordinates={object.updateDirection}
		/>
	)
	return (
		<div id="selection-editor">
			<h1>{`${object.type}: ${object.name}`}</h1>
			<InputGroup name="Follow" id="follow">
				<input onChange={followObject} type="checkbox" id="follow" checked={objectIsFocused}/>
			</InputGroup>
			<InputGroup name="Label" id="label">
				<input
					type="text"
					id="label"
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
				object.type !== 'Vector' &&
				<ColorPicker
					name="Outline color"
					updateColor={object.updateOutlineColor}
					defaultColor={object.outlineColor}
				/>
			}
			{coordinateEditor}
		</div>
	);
}

export default SelectionEditor;