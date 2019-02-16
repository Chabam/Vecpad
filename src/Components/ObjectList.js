import React from 'react';
import ObjectInfo from './ObjectInfo';

const ObjectList = ({objectList, selectObject, focusObject, removeObject}) => {
	let objects = objectList.map((object, i) => (
		<ObjectInfo
			key={i}
			object={object}
			focusObject={focusObject}
			selectObject={selectObject}
			removeObject={removeObject}
		/>
	));

	return (
	<div id="object-list">
		{objects}
	</div>
	);
}

export default ObjectList;