import React, { Component } from 'react';
import THREEHelper from '../Object-Model/THREE/THREEHelper';
import SelectionEditor from './Sidebar/SelectionEditor';
import Sidebar from './Sidebar/Sidebar';
import logo from '../Images/logo.svg'
import SceneEditor from './Sidebar/SceneEditor';
import Timeline from './Timeline/Timeline';
import TransformationEditor from './Timeline/TransformationEditor';

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

	componentDidUpdate() {
		this.state.THREEHelper.setDimensions(true);
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
					{
						sceneHelper.selectedObject &&
						<Timeline>
							<TransformationEditor
								object={sceneHelper.selectedObject}
							/>
						</Timeline>
					}
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