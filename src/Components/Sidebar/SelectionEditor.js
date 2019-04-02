import React from 'react';
import * as THREE from 'three';
import InputGroup from '../Inputs/InputGroup';
import CoordinatesPicker from '../Inputs/CoordinatesPicker';
import ColorPicker from '../Inputs/ColorPicker';
import VecpadMesh from '../../Object-Model/VecpadMesh';
import ObjectHelper from '../../Object-Model/THREE/ObjectHelper';
import Matrix from '../Inputs/Matrix';

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
				updateCoordinates={object.updateVector}
			/>
		);
	}

	let typeSpecificControls;

	switch(object.type) {
		case 'Operation':
			let availableVectors = sceneHelper.getVectors();
			let v1s = availableVectors.map((vector, i) => (
				<option key={i} value={vector.id}>{vector.name}</option>
			));
			let v2s = availableVectors.map((vector, i) => (
				<option key={i} value={vector.id}>{vector.name}</option>
			));
			const updateV1 = (event) => object.setV1(
				sceneHelper.THREEScene.getObjectById(parseInt(event.target.value))
			);
			const updateV2 = (event) => object.setV2(
				sceneHelper.THREEScene.getObjectById(parseInt(event.target.value))
			);
			typeSpecificControls = (
				<React.Fragment>
					<InputGroup name="Vector 1">
						<select onChange={updateV1} value={object.v1 ? object.v1.id : -1}>
							<option value={-1}></option>
							{v1s}
						</select>
					</InputGroup>
					<InputGroup name="Vector 2">
						<select onChange={updateV2} value={object.v2 ? object.v2.id : -1}>
							<option value={-1}></option>
							{v2s}
						</select>
					</InputGroup>
				</React.Fragment>
			);
			break;
		case 'Vector':
			typeSpecificControls = (
				<React.Fragment>
					<InputGroup name="Normalize">
						<input type="checkbox" checked={object.normalize} onChange={object.updateNormalize}/>
					</InputGroup>
				</React.Fragment>
			);
			break;
		case 'Triangle': {
			let { width } = object.geometry.parameters;
			const updateTriangleGeometry = (event) => {
				object.updateGeometry(ObjectHelper.createTriangleGeometry(parseFloat(event.target.value)));
			}

			typeSpecificControls = (
				<React.Fragment>
					<InputGroup name="Width">
						<input type="number" step={0.01} defaultValue={width} onChange={updateTriangleGeometry}/>
					</InputGroup>
				</React.Fragment>
			);
			break;
		}
		case 'Quad': {
			let { width, height } = object.geometry.parameters;
			const updateQuadGeometry = (width, height) => {
				object.updateGeometry(new THREE.PlaneGeometry(width, height));
			}

			const updateWidth = (event) => updateQuadGeometry(parseFloat(event.target.value), height);
			const updateHeight = (event) => updateQuadGeometry(width, parseFloat(event.target.value));

			typeSpecificControls = (
				<React.Fragment>
					<InputGroup name="Width">
						<input type="number" step={0.01} defaultValue={width} onChange={updateWidth}/>
					</InputGroup>
					<InputGroup name="Height">
						<input type="number" step={0.01} defaultValue={height} onChange={updateHeight}/>
					</InputGroup>
				</React.Fragment>
			);
			break;
		}
		case 'Cube': {
			let { width, height, depth } = object.geometry.parameters;
			const updateQuadGeometry = (width, height, depth) => {
				object.updateGeometry(new THREE.BoxGeometry(width, height, depth));
			}

			const updateWidth = (event) => updateQuadGeometry(parseFloat(event.target.value), height, depth);
			const updateHeight = (event) => updateQuadGeometry(width, parseFloat(event.target.value), depth);
			const updateDepth = (event) => updateQuadGeometry(width, height, parseFloat(event.target.value));

			typeSpecificControls = (
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
			break;
		}
		default:
			typeSpecificControls = (<React.Fragment>No type</React.Fragment>);
			break;

	}
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
			{coordinatesEditor}
			{typeSpecificControls}
			<hr/>
			<h1>Transformation matrix</h1>
			<Matrix matrix={transformationMatrix}/>
		</div>
	);
}

export default SelectionEditor;