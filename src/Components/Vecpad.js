import React, { Component } from 'react';
import THREEHelper from '../Object-Model/THREE/THREEHelper';
import Visualizer from './Visualizer';
import SelectionEditor from './Sidebar/SelectionEditor';
import Sidebar from './Sidebar/Sidebar';
import Modal from './Modals/Modal';
import logo from '../Images/logo.svg'
import SceneEditor from './Sidebar/SceneEditor';

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

	// Whenever THREEHelper changes it will call this function to update the UI.
	updateReactState = (newTHREEState) => this.setState({
		THREEHelper: newTHREEState
	});

	componentDidMount() {
		window.addEventListener('load', () => {
			this.state.THREEHelper.init();
		});
	}

	render() {
		const { THREEHelper } = this.state;
		const { sceneHelper, cameraHelper } = THREEHelper;
		return (
			<div id="vecpad-container">
				<div id="visualizer-container">
					<div id='logo'>
						<img src={logo} alt={'Vecpad\'s logo'}></img>
					</div>
					<Visualizer/>
				</div>
				<Sidebar>
					<SceneEditor
						sceneHelper={sceneHelper}
						cameraHelper={cameraHelper}
					/>
					{
						sceneHelper.selectedObject &&
						<SelectionEditor
							object={sceneHelper.selectedObject}
							cameraHelper={cameraHelper}
						/>
					}
				</Sidebar>
			</div>
		);
	}
}