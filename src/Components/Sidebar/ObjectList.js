import React from 'react';
import ObjectInfo from './ObjectInfo';

// This component will hold all the objectInfos of the scene.
const ObjectList = ({objectList, sceneHelper}) => {
	let objects = objectList.map((object, i) => (
		<ObjectInfo
			key={i}
			object={object}
			selected={
				sceneHelper.selectedObject !== null &&
				sceneHelper.selectedObject === object
			}
			selectObject={sceneHelper.selectObject}
			removeObject={sceneHelper.removeObject}
		/>
	));

	return (
		<div id="object-list">
			{objects}
		</div>
	);
};

export default ObjectList;