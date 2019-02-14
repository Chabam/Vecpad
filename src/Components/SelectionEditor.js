import React, { Component } from 'react';

// This component will show the specific details of the currently selected object
export default class SelectionEditor extends Component {
	render() {
		return (
			<div id="selection-editor">
				<h1>{this.props.selectedObject.name}</h1>
			</div>
		);
	}

	removeObject = (event) => {
		this.props.removeObject(parseInt(event.target.value))
	}
}