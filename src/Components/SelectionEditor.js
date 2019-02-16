import React from 'react';
import TransformationList from './TransformationList';

// This component will show the specific details of the currently selected object
const SelectionEditor = ({object, openTransformationModal, applyTransformation}) => {
	let worldPositions = object.geometry.vertices.map((vertex, i) => {
		let position = vertex.clone().applyMatrix4(object.matrixWorld);
		let {x, y, z} = position;
		return <li key={i}>X: {x.toFixed(2)} Y: {y.toFixed(2)} Z: {z.toFixed(2)}</li>;
	});
	const callOpenTransformationModal = () => openTransformationModal(object.id);
	const callApplyTransformation = (transformationUUID, step) => applyTransformation(
		object.id,
		transformationUUID,
		step
	);
	return (
		<div id="selection-editor">
			<h1>{object.name}</h1>
			<h2>{`Type: ${object.type}`}</h2>
			<ul>
				{worldPositions}
			</ul>
			<button onClick={callOpenTransformationModal}>Add a transformation</button>
			<TransformationList
				transformationList={object.transformations}
				applyTransformation={callApplyTransformation}
				removeTransformation={object.removeTransformation}
			/>
		</div>
	);
}

export default SelectionEditor;