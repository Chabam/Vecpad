import React, { Component } from 'react';
import Visualizer from './Visualizer';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import Modal from './Modal';
import THREEHelper from '../THREE/THREEHelper';

/*
	This is the instance of the application, it is the only component that will
	contain a state.
*/
export default class Vecpad extends Component {
	constructor(props) {
		super(props);
		// This is our only state, which is an instance of THREEHelper.
		this.state = {
			THREEHelper: new THREEHelper(this.updateReactState),
			modalVisible: false
		}
	}

	componentDidMount() {
		this.state.THREEHelper.init();

		const modal = document.getElementById('modal-container');
		window.addEventListener('click', (event) => {
			if (event.target == modal) {
				this.closeModal();
			}
		});
	}

	render() {
		const { THREEHelper, modalVisible } = this.state;
		return (
			<div id="vecpad-container">
				<div id="visualizer-container">
					<Toolbar
						displayMode={THREEHelper.currentDisplayMode}
						updateDisplayMode={THREEHelper.setDisplayMode}
						groundSize={THREEHelper.groundSize}
						updateGround={THREEHelper.updateGround}
						addObject={this.openModal}>
					</Toolbar>
					<Visualizer initializeTHREE={THREEHelper.init}></Visualizer>
				</div>
				<Sidebar
					objectList={THREEHelper.objectList}
					removeObject={THREEHelper.removeObject}
					selectedObject={THREEHelper.selectedObject}>
				</Sidebar>
				<Modal visible={modalVisible} closeModal={this.closeModal}></Modal>
			</div>
			);
	}

	openModal = () => this.setState((state) => ({modalVisible: true, THREEHelper: state.THREEHelper}));

	closeModal = () => this.setState((state) => ({modalVisible: false, THREEHelper: state.THREEHelper}));

	// Whenever THREEHelper changes it will call this function to update the UI.
	updateReactState = (newTHREEState) => this.setState((state) => ({modalVisible: state.modalVisible, THREEHelper: newTHREEState}));
}