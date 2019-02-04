import React, { Component } from 'react';

export default class Visualizer extends Component {
	componentDidMount() {
		this.props.initializeTHREE();
	}

	render() {
		return (<div id="visualizer"></div>);
	}
}