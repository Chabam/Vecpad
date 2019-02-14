import React from 'react';

/*
	This component will show the specific details of an object. It will also be
	used to apply actions on an object (deleting, apply transformations, etc.)
*/
const ObjectInfo = ({name, id, vertices, removeObject}) => {
	let verticesElem = vertices.map((vertex, i) => {
		let {x, y, z} = vertex;
		return (<li key={i}>X: {x} Y: {y} Z: {z}</li>)
	});

	const callRemoveObject = (event) => {
		removeObject(parseInt(event.target.value))
	}

	return (
		<div className="object-info">
			<h1>{name}</h1>
			<ul>
				{verticesElem}
			</ul>
			<button onClick={callRemoveObject} value={id}>Delete</button>
		</div>
	);
}

export default ObjectInfo;