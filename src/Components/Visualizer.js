import React, { Component } from 'react';

// This component will be the one containing the canvas used by THREE.js
export default class Visualizer extends Component {

	// When the component is rendered we initalize our THREEHelper instance
	componentDidMount() {
		this.props.initializeTHREE();
	}

	render() {
		return (<div id="visualizer"></div>);
	}
}