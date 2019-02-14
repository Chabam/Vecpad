import React, { Component } from 'react';
import Visualizer from './Visualizer';
import Toolbar from './Toolbar';
import Modal from './Modal';
import SelectionEditor from './SelectionEditor';
import ObjectInfo from './ObjectInfo';
import ObjectCreator from './ObjectCreator';
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
			modalTitle: null,
			modalContent: null
		}
	}

	// Whenever THREEHelper changes it will call this function to update the UI.
	updateReactState = (newTHREEState) => this.setState((state) => ({
		...state,
		THREEHelper: newTHREEState
	}));

	componentDidMount() {
		this.state.THREEHelper.init();

		const modal = document.getElementById('modal-container');
		window.addEventListener('click', (event) => {
			if (event.target === modal) {
				this.closeModal();
			}
		});
	}

	render() {
		const { THREEHelper, modalTitle, modalContent } = this.state;
		return (
			<div id="vecpad-container">
				<div id="visualizer-container">
					<Toolbar
						displayMode={THREEHelper.currentDisplayMode}
						updateDisplayMode={THREEHelper.setDisplayMode}
						groundSize={THREEHelper.groundSize}
						updateGround={THREEHelper.updateGround}
						addObject={this.openObjectModal}>
					</Toolbar>
					<Visualizer initializeTHREE={THREEHelper.init}></Visualizer>
				</div>
				<nav id="sidebar">
					<div id="object-list">
						{this.renderObjectList()}
					</div>
					{THREEHelper.selectedObject &&
						<SelectionEditor object={THREEHelper.selectedObject}></SelectionEditor>
					}
				</nav>
				<Modal title={modalTitle} content={modalContent} closeModal={this.closeModal}></Modal>
			</div>
		);
	}

	openObjectModal = () => this.setState((state) => ({
		...state,
		modalTitle: 'Create an object',
		modalContent: <ObjectCreator
			addVector={state.THREEHelper.addVector}
			addTriangle={state.THREEHelper.addTriangle}
			addQuad={state.THREEHelper.addQuad}
			addCube={state.THREEHelper.addCube}
			closeModal={this.closeModal}></ObjectCreator>
	}));

	closeModal = () => this.setState((state) => ({
		...state,
		modalTitle: null,
		modalContent: null
	}));

	renderObjectList = () => {
		let { THREEHelper } = this.state;
		return THREEHelper.objectList.map((object) =>
			<ObjectInfo
				key={object.id}
				id={object.id}
				name={object.name}
				type={object.type}
				selectObject={THREEHelper.applySelectionOnID}
				removeObject={THREEHelper.removeObjectById}>
			</ObjectInfo>
		);
	}
}