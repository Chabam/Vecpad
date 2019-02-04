import React, { Component } from 'react';
import Visualizer from './Visualizer';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import THREEHelper from '../THREE/THREEHelper';

export default class Vecpad extends Component {
	constructor(props) {
		super(props);
		this.state = {
			THREEHelper: new THREEHelper()
		};
	}

	render() {
		const { THREEHelper } = this.state;
		let addBasicTriangle = () => THREEHelper.addTriangle(1, 0xffffff, 0x000000, 'Basic Triangle');
		let addBasicQuad = () => THREEHelper.addQuad(1, 1, 0xffffff, 0x000000, 'Basic Quad');
		let addBasicCube = () => THREEHelper.addCube(1, 1, 1, 0xffffff, 0x000000, 'Basic Cube');
		return (
			<div id="vecpad-container">
				<div id="visualizer-container">
					<Toolbar
						displayMode={THREEHelper.currentDisplayMode}
						updateDisplayMode={THREEHelper.setDisplayMode}
						addBasicTriangle={addBasicTriangle}
						addBasicQuad={addBasicQuad}
						addBasicCube={addBasicCube}
						></Toolbar>
					<Visualizer initializeTHREE={THREEHelper.init}></Visualizer>
				</div>
			<Sidebar></Sidebar>
			</div>
			);
		}
	}