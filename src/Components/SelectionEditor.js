import React from 'react';
import TransformationList from './TransformationList';
import InputGroup from './InputGroup';

// This component will show the specific details of the currently selected object
const SelectionEditor = ({object, cameraHelper, openTransformationModal, openOperationModal, openMatrixViewModal}) => {
	let worldPositions = object.geometry.vertices.map((vertex, i) => {
		let position = vertex.clone().applyMatrix4(object.matrixWorld);
		let {x, y, z} = position;
		return <li key={i}>X: {x.toFixed(2)} Y: {y.toFixed(2)} Z: {z.toFixed(2)}</li>;
	});
	const followObject = (e) => {
		if (e.target.checked) {
			cameraHelper.focusOnObject(object);
		} else {
			cameraHelper.reset();
			object.unregisterCallback();
		}
	}
	return (
		<div id="selection-editor">
			<h1>{object.name}</h1>
			<h2>{`Type: ${object.type}`}</h2>
			<ul>
				{worldPositions}
			</ul>
			<InputGroup name="Follow" id="follow">
				<input onChange={followObject} type="checkbox" id="follow"/>
			</InputGroup>
			<div>
				<button onClick={() => openTransformationModal(object)}>Add a transformation</button>
			</div>
			{object.type === 'Vector' &&
				<div>
					<button onClick={() => openOperationModal(object)}>Add Operation</button>
				</div>
			}
			{object.transformations.length > 0 &&
				<TransformationList
				transformationList={object.transformations}
				removeTransformation={object.removeTransformation}
				openMatrixViewModal={openMatrixViewModal}
				/>
			}
		</div>
	);
}

export default SelectionEditor;