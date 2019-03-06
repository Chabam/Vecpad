import React from 'react';
import SceneHelper from '../../Object-Model/THREE/SceneHelper'
import logo from '../../Images/logo.svg'
import InputGroup from '../Inputs/InputGroup';

/*
	This component will be used to control common settings of the application.
	For exemple: the display mode, adding an object, undo and redo, etc.
*/
const Toolbar = ({sceneHelper, cameraHelper, openModal}) => {
	let { reset } = cameraHelper;
	let { applyDisplayMode, updateGraph } = sceneHelper;
	const callApplyDisplayMode = (event) => applyDisplayMode(parseInt(event.target.value));
	const callUpdateGraph = (event) => updateGraph(parseInt(event.target.value));

	return (
		<nav id="toolbar">
			<div id='logo'>
				<img src={logo} alt={'Vecpad\'s logo'}></img>
			</div>
			<div>
				<InputGroup name='Display Mode' id='display-mode'>
					<select name='display-mode' onChange={callApplyDisplayMode} defaultValue={sceneHelper.currentDisplayMode}>
						<option value={SceneHelper.DisplayMode.OUTLINE}>
							Outline
						</option>
						<option value={SceneHelper.DisplayMode.FILL}>
							Fill
						</option>
						<option value={SceneHelper.DisplayMode.BOTH}>
							Both
						</option>
					</select>
				</InputGroup>
			</div>
			<div>
				<button onClick={openModal}>Add an object</button>
			</div>
			<div>
				<button onClick={reset}>Reset camera</button>
			</div>
			<div>
				<InputGroup name={`Graph size (${sceneHelper.THREEScene.graph.size})`} id='graph-size'>
					<input name='graph-size' type="range" min="2" max="100" step="2" onChange={callUpdateGraph} value={sceneHelper.THREEScene.graph.size}/>
				</InputGroup>
			</div>
		</nav>
	);
}

export default Toolbar;