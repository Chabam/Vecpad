import React from 'react';

/*
	This component will show the specific details of an object. It will also be
	used to apply actions on an object (deleting, apply transformations, etc.)
*/
const ObjectInfo = ({object, selected, selectObject, removeObject}) => {
	return (
		<div className={`object-info ${selected ? 'selected' : ''}`} >
			<p onClick={() => selectObject(object)}>{`${object.type}: ${object.name}`}</p>
			<button className="material-icons delete text-only" onClick={() => removeObject(object)} title={`Remove '${object.name}' from the scene`}>remove</button>
		</div>
	);
};

export default ObjectInfo;