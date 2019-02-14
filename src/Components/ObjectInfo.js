import React from 'react';

/*
	This component will show the specific details of an object. It will also be
	used to apply actions on an object (deleting, apply transformations, etc.)
*/
const ObjectInfo = ({name, id, type, removeObject, selectObject}) => {
	const callRemoveObject = (event) => removeObject(parseInt(event.target.value));
	const callSelectObject = (event) => selectObject(parseInt(event.target.value));

	return (
		<div className="object-info">
			<h1>{name}</h1>
			<h2>{`Type: ${type}`}</h2>
			<button onClick={callRemoveObject} value={id}>Delete</button>
			<button onClick={callSelectObject} value={id}>Select</button>
		</div>
	);
}

export default ObjectInfo;