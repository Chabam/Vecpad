import React from 'react';

/*
	This component will show the specific details of an object. It will also be
	used to apply actions on an object (deleting, apply transformations, etc.)
*/
const ObjectInfo = ({object, selectObject, removeObject}) => {
	return (
		<div className="object-info">
			<h1>{object.name}</h1>
			<h2>{`Type: ${object.type}`}</h2>
			<button onClick={() => removeObject(object)}>Delete</button>
			<button onClick={() => selectObject(object)}>Select</button>
		</div>
	);
}

export default ObjectInfo;