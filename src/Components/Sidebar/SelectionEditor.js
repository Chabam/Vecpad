import React from 'react';
import * as THREE from 'three';
import InputGroup from '../Inputs/InputGroup';
import ColorPicker from '../Inputs/ColorPicker';
import VecpadMesh from '../../Object-Model/VecpadMesh';
import Matrix from '../Inputs/Matrix';

// This component will show the specific details of the currently selected object
const SelectionEditor = ({object, sceneHelper, cameraHelper}) => {
	const followObject = (e) => {
		if (e.target.checked) {
			cameraHelper.focusObject(object);
		} else {
			cameraHelper.unfocusObject();
		}
	}

	let objectIsFocused = cameraHelper.focusedObject !== null && cameraHelper.focusedObject.object === object;

	let transformationMatrix = object.transformations.reduce((matrix, trans) =>
		trans.getMatrix().multiply(matrix),
		new THREE.Matrix4()
	);

	return (
		<div id="selection-editor" key={object.uuid}>
			<h1>{`${object.type}: ${object.name}`}</h1>
			<InputGroup name="Follow">
				<input onChange={followObject} type="checkbox" checked={objectIsFocused}/>
			</InputGroup>
			<InputGroup name="Label">
				<input
					type="text"
					defaultValue={object.name}
					onChange={(event) => object.updateLabel(event.target.value)}
				/>
			</InputGroup>
			<ColorPicker
				name="Color"
				updateColor={object.updateColor}
				defaultColor={object.material.color.getHex()}
			/>
			{
				object instanceof VecpadMesh &&
				<ColorPicker
					name="Outline color"
					updateColor={object.updateOutlineColor}
					defaultColor={object.outline.material.color.getHex()}
				/>
			}
			{object.getCoordinatesEditor()}
			{object.getTypeSpecificControls(sceneHelper)}
			<hr/>
			<h1>Transformation matrix</h1>
			<Matrix matrix={transformationMatrix}/>
		</div>
	);
}

export default SelectionEditor;