import React, { Component } from 'react';
import Visualizer from './Visualizer';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import THREEHelper from '../THREE/THREEHelper';

export default class Vecpad extends Component {
	constructor(props) {
		super(props);
		this.THREEHelper = new THREEHelper()
	}

	render() {
		let addBasicTriangle = () => this.THREEHelper.addTriangle(1, 0xffffff, 0x000000, 'Basic Triangle');
		let addBasicQuad = () => this.THREEHelper.addQuad(1, 1, 0xffffff, 0x000000, 'Basic Quad');
		let addBasicCube = () => this.THREEHelper.addCube(1, 1, 1, 0xffffff, 0x000000, 'Basic Cube');
		return (
			<div id="vecpad-container">
				<div id="visualizer-container">
					<Toolbar
						displayMode={this.THREEHelper.currentDisplayMode}
						updateDisplayMode={this.THREEHelper.setDisplayMode}
						addBasicTriangle={addBasicTriangle}
						addBasicQuad={addBasicQuad}
						addBasicCube={addBasicCube}>
					</Toolbar>
					<Visualizer initializeTHREE={this.THREEHelper.init}></Visualizer>
				</div>
			<Sidebar></Sidebar>
			</div>
			);
		}
	}