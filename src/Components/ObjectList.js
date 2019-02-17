import React from 'react';
import ObjectInfo from './ObjectInfo';

const ObjectList = ({objectList, THREEHelper, sceneHelper}) => {
	let objects = objectList.map((object, i) => (
		<ObjectInfo
			key={i}
			object={object}
			selectObject={THREEHelper.selectObject}
			removeObject={sceneHelper.removeObject}
		/>
	));

	return (
	<div id="object-list">
		{objects}
	</div>
	);
}

export default ObjectList;