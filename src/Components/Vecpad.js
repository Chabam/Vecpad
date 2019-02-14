import React, { Component } from 'react';
import Visualizer from './Visualizer';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import THREEHelper from '../THREE/THREEHelper';
import * as THREE from 'three';

/*
	This is the instance of the application, it is the only component that will
	contain a state.
*/
export default class Vecpad extends Component {
	constructor(props) {
		super(props);
		// This is our only state, which is an instance of THREEHelper.
		this.state = {
			THREEHelper: new THREEHelper(this.updateReactState)
		}
	}

	render() {
		const { THREEHelper } = this.state;
		return (
			<div id="vecpad-container">
				<div id="visualizer-container">
					<Toolbar
						displayMode={THREEHelper.currentDisplayMode}
						updateDisplayMode={THREEHelper.setDisplayMode}
						addVector={THREEHelper.addVector}
						addTriangle={THREEHelper.addTriangle}
						addQuad={THREEHelper.addQuad}
						addCube={THREEHelper.addCube}
						updateGround={THREEHelper.updateGround}
						groundSize={THREEHelper.groundSize}>
					</Toolbar>
					<Visualizer initializeTHREE={THREEHelper.init}></Visualizer>
				</div>
			<Sidebar
				objectList={THREEHelper.objectList}
				removeObject={THREEHelper.removeObject}
				selectedObject={THREEHelper.selectedObject}></Sidebar>
			</div>
			);
		}

	// Whenever THREEHelper changes it will call this function to update the UI.
	updateReactState = (newTHREEState) => this.setState({THREEHelper: newTHREEState});
}