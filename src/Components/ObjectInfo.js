import React from 'react';

/*
	This component will show the specific details of an object. It will also be
	used to apply actions on an object (deleting, apply transformations, etc.)
*/
const ObjectInfo = ({object, removeObject, focusObject, selectObject}) => {
	let {id, name, type } = object;

	const callRemoveObject = () => removeObject(id);
	const callSelectObject = () => selectObject(id);
	const callFocusObject = () => focusObject(id);

	return (
		<div className="object-info">
			<h1>{name}</h1>
			<h2>{`Type: ${type}`}</h2>
			<button onClick={callRemoveObject}>Delete</button>
			<button onClick={callSelectObject}>Select</button>
			<button onClick={callFocusObject}>Focus</button>
		</div>
	);
}

export default ObjectInfo;