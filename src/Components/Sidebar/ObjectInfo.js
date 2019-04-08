import React from 'react';

// A component used to delete a single object and show its name.
const ObjectInfo = ({object, selected, selectObject, removeObject}) => {
	return (
		<div className={`object-info ${selected ? 'selected' : ''}`} >
			<p onClick={() => selectObject(object)}>{`${object.type}: ${object.name}`}</p>
			<button className="material-icons delete text-only"
				onClick={() => removeObject(object)} title={`Remove '${object.name}' from the scene`}>
				remove
			</button>
		</div>
	);
};

export default ObjectInfo;