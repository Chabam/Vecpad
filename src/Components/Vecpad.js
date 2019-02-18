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
import MatrixViewer from './MatrixViewer';

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
		window.addEventListener('load', () => {
			this.state.THREEHelper.init()

			const modal = document.getElementById('modal-container');
			window.addEventListener('click', (event) => {
				if (event.target === modal) {
					this.closeModal();
				}
			});
		});
	}

	render() {
		const { THREEHelper, modalTitle, modalContent } = this.state;
		const { sceneHelper, cameraHelper } = THREEHelper;
		return (
			<div id="vecpad-container">
				<div id="visualizer-container">
					<Toolbar
						sceneHelper={sceneHelper}
						cameraHelper={cameraHelper}
						openModal={this.openObjectModal}
					/>
					<Visualizer/>
				</div>
				<Sidebar>
					<ObjectList
						objectList={sceneHelper.getVecpadObjectList()}
						sceneHelper={sceneHelper}/>
						{sceneHelper.selectedObject &&
						<SelectionEditor
							object={sceneHelper.selectedObject}
							cameraHelper={cameraHelper}
							openTransformationModal={this.openTransformationModal}
							openMatrixViewModal={this.openMatrixViewModal}
						/>}
				</Sidebar>
				<Modal title={modalTitle} closeModal={this.closeModal}>{modalContent}</Modal>
			</div>
		);
	}

	openObjectModal = () => this.setState((state) => {
		let { sceneHelper } = state.THREEHelper;
		return {
			...state,
			modalTitle: 'Create an object',
			modalContent: <ObjectCreator
				sceneHelper={sceneHelper}
				closeModal={this.closeModal}
			/>
		};
	});

	openTransformationModal = (object) => this.setState((state) => ({
		...state,
		modalTitle: 'Create a transformation',
		modalContent: <TransformationCreator
			object={object}
			closeModal={this.closeModal}
		/>
	}));

	openMatrixViewModal = (transformation) => this.setState((state) => ({
		...state,
		modalTitle: `Details of ${transformation.name}`,
		modalContent: <MatrixViewer
			transformation={transformation}
		/>
	}));

	closeModal = () => this.setState((state) => ({
		...state,
		modalTitle: null,
		modalContent: null
	}));
}