import React, { Component } from 'react';
import ObjectInfo from './ObjectInfo';

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
				{objectList}
			</nav>
		);
	}
}