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
		}
	}

	render() {
		const { THREEHelper } = this.state;
		let addTriangle = this.createStateFunc((THREEHelper) => THREEHelper.addTriangle(1, 0xfffffff, 0x000000));
		let addQuad = this.createStateFunc((THREEHelper) => THREEHelper.addQuad(1, 1, 0xfffffff, 0x000000));
		let addCube = this.createStateFunc((THREEHelper) => THREEHelper.addCube(1, 1, 1, 0xfffffff, 0x000000));
		let removeObject = (id) => this.createStateFunc((THREEHelper) => THREEHelper.removeObject(id)).call();
		let updateGround = (size) => this.createStateFunc((THREEHelper) => THREEHelper.updateGround(size)).call();
		return (
			<div id="vecpad-container">
				<div id="visualizer-container">
					<Toolbar
						displayMode={THREEHelper.currentDisplayMode}
						updateDisplayMode={THREEHelper.setDisplayMode}
						addBasicTriangle={addTriangle}
						addBasicQuad={addQuad}
						addBasicCube={addCube}
						updateGround={updateGround}
						groundSize={THREEHelper.groundSize}>
					</Toolbar>
					<Visualizer initializeTHREE={THREEHelper.init}></Visualizer>
				</div>
			<Sidebar objectList={THREEHelper.objectList} removeObject={removeObject}></Sidebar>
			</div>
			);
		}

		createStateFunc = (func) => {
			return () => {
				this.setState((state) => {
					const { THREEHelper } = state;
					func(THREEHelper);
					return { THREEHelper };
				});
			}
		}
	}