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
			THREEHelper: new THREEHelper()
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
						addBasicVector={this.addVector}
						addBasicTriangle={this.addTriangle}
						addBasicQuad={this.addQuad}
						addBasicCube={this.addCube}
						updateGround={this.updateGround}
						groundSize={THREEHelper.groundSize}>
					</Toolbar>
					<Visualizer initializeTHREE={THREEHelper.init}></Visualizer>
				</div>
			<Sidebar objectList={THREEHelper.objectList} removeObject={this.removeObject}></Sidebar>
			</div>
			);
		}

		/*
			This is function is used to create a function that is able to manipulate
			the THREEHelper while applying it to the state. The reason we need this function
			is because THREEHelper manages its own "state", hence we can't use the setState
			from React alone. In fact, we extract the current application state (THREEHelper)
			and call the THREEHelper function on it, this will create a side effect.
			We then set the state we this modified version of the object.
		*/
		createStateFunc = (func) => {
			return () => {
				this.setState((state) => {
					const { THREEHelper } = state;
					func(THREEHelper);
					return { THREEHelper };
				});
			}
		}

		// The rest of the functions are used to communicate with THREEHelper using createStateFunc

		addVector =  this.createStateFunc((THREEHelper) => {
			let origin = new THREE.Vector3(0, 0, 0);
			let direction = new THREE.Vector3(1, 1, 1).normalize();
			THREEHelper.addVector(direction, origin, 1, 0x000000, 'Amazing vector');
		});

		addTriangle = this.createStateFunc((THREEHelper) => THREEHelper.addTriangle(1, 0xfffffff, 0x000000));

		addQuad = this.createStateFunc((THREEHelper) => THREEHelper.addQuad(1, 1, 0xfffffff, 0x000000));

		addCube = this.createStateFunc((THREEHelper) => THREEHelper.addCube(1, 1, 1, 0xfffffff, 0x000000));

		removeObject = (id) => this.createStateFunc((THREEHelper) => THREEHelper.removeObject(id)).call();

		updateGround = (size) => this.createStateFunc((THREEHelper) => THREEHelper.updateGround(size)).call();
	}