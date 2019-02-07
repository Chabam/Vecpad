import React, { Component } from 'react';

/*
	This component will show the specific details of an object. It will also be
	used to apply actions on an object (deleting, apply transformations, etc.)
*/
export default class ObjectInfo extends Component {
	render() {
		let vertices = this.props.vertices.map((vertex, i) => {
			let {x, y, z} = vertex;
			return (<li key={i}>X: {x} Y: {y} Z: {z}</li>)
		});

		return (
			<div className="object-info">
				<h1>{this.props.name}</h1>
				<ul>
					{vertices}
				</ul>
				<button onClick={this.removeObject} value={this.props.id}>Delete</button>
			</div>
		);
	}


	removeObject = (event) => {
		this.props.removeObject(parseInt(event.target.value))
	}
}