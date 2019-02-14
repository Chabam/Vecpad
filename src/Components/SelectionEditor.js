import React from 'react';

// This component will show the specific details of the currently selected object
const SelectionEditor = ({object}) => {
	let worldPositions = object.geometry.vertices.map((vertex, i) => {
		let position = vertex.clone().applyMatrix4(object.matrixWorld);
		let {x, y, z} = position;
		return <li key={i}>X: {x.toFixed(2)} Y: {y.toFixed(2)} Z: {z.toFixed(2)}</li>;
	})
	return (
		<div id="selection-editor">
			<h1>{object.name}</h1>
			<h2>{`Type: ${object.type}`}</h2>
			<ul>
				{worldPositions}
			</ul>
		</div>
	);
}

export default SelectionEditor;