import React, { Component } from 'react';
import Visualizer from './Visualizer';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import THREEHelper from '../THREE/THREEHelper';
import * as THREE from 'three';

export default class Vecpad extends Component {
	constructor(props) {
		super(props);
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

		createStateFunc = (func) => {
			return () => {
				this.setState((state) => {
					const { THREEHelper } = state;
					func(THREEHelper);
					return { THREEHelper };
				});
			}
		}

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