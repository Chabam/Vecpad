import React, { Component } from 'react';
import ObjectInfo from './ObjectInfo';
import SelectionEditor from './SelectionEditor';

// This component will contain the objects that are rendered in the scene.
export default class Sidebar extends Component {
	render() {
		let objectList = this.props.objectList.map((object) =>
			(<ObjectInfo
				key={object.id}
				id={object.id}
				name={object.name}
				vertices={object.vertices}
				removeObject={this.props.removeObject}></ObjectInfo>)
		);
		return (
			<nav id="sidebar">
				<div id="object-list">
					{objectList}
				</div>
				{this.props.selectedObject &&
					<SelectionEditor selectedObject={this.props.selectedObject}></SelectionEditor>
				}
			</nav>
		);
	}
}