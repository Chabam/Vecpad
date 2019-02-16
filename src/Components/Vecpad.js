import React, { Component } from 'react';
import THREEHelper from '../THREE/THREEHelper';
import Visualizer from './Visualizer';
import Toolbar from './Toolbar';
import Modal from './Modal';
import ObjectCreator from './ObjectCreator';
import SelectionEditor from './SelectionEditor';
import Sidebar from './Sidebar';
import ObjectList from './ObjectList';
import TransformationCreator from './TransformationCreator';

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
						addObject={this.openObjectModal}
						resetCamera={THREEHelper.resetCamera}
					/>
					<Visualizer initializeTHREE={THREEHelper.init}/>
				</div>
				<Sidebar>
					<ObjectList
						objectList={THREEHelper.objectList}
						selectObject={THREEHelper.applySelectionOnID}
						removeObject={THREEHelper.removeObjectById}
						focusObject={THREEHelper.focusOnObjectID}/>
						{THREEHelper.selectedObject &&
						<SelectionEditor
							object={THREEHelper.selectedObject}
							openTransformationModal={this.openTransformationModal}
							applyTransformation={THREEHelper.applyTransformationStepOnObjectByID}
						/>}
				</Sidebar>
				<Modal title={modalTitle} closeModal={this.closeModal}>{modalContent}</Modal>
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
			closeModal={this.closeModal}
		/>
	}));

	openTransformationModal = (id) => this.setState((state) => ({
		...state,
		modalTitle: 'Create an object',
		modalContent: <TransformationCreator
			id={id}
			addTranslation={state.THREEHelper.addTranslationByID}
			closeModal={this.closeModal}
		/>
	}));

	closeModal = () => this.setState((state) => ({
		...state,
		modalTitle: null,
		modalContent: null
	}));
}