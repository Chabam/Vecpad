import React from 'react';
import ObjectInfo from './ObjectInfo';
import SelectionEditor from './SelectionEditor';

// This component will contain the objects that are rendered in the scene.
const Sidebar = ({objectList, selectedObject, removeObject}) => {
	const objectListElems = objectList.map((object) =>
		(<ObjectInfo
			key={object.id}
			id={object.id}
			name={object.name}
			vertices={object.vertices}
			removeObject={removeObject}></ObjectInfo>)
	);

	return (
		<nav id="sidebar">
			<div id="object-list">
				{objectListElems}
			</div>
			{selectedObject &&
				<SelectionEditor selectedObject={selectedObject}></SelectionEditor>
			}
		</nav>
	);
}

export default Sidebar;