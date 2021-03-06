import React from 'react';
import SceneHelper from '../../Object-Model/THREE/SceneHelper';
import ObjectList from './ObjectList';
import InputGroup from '../Inputs/InputGroup';

const objectType = {
	VECTOR: 0,
	TRIANGLE: 1,
	QUAD: 2,
	CUBE: 3,
	ADDITION: 4,
	SUBTRACTION: 5,
	CROSS: 6
};

// This component holds all the controls used for the entire scene.
const SceneEditor = ({sceneHelper, cameraHelper}) => {
	const createObject = (event) => {
		switch(parseInt(event.target.value)) {
		case objectType.VECTOR:
			sceneHelper.addVector();
			break;
		case objectType.TRIANGLE:
			sceneHelper.addTriangle();
			break;
		case objectType.QUAD:
			sceneHelper.addQuad();
			break;
		case objectType.CUBE:
			sceneHelper.addCube();
			break;
		case objectType.ADDITION:
			sceneHelper.addVectorAddition();
			break;
		case objectType.SUBTRACTION:
			sceneHelper.addVectorSubtraction();
			break;
		case objectType.CROSS:
			sceneHelper.addVectorCross();
			break;
		default:
			event.preventDefault();
			break;
		}
	};

	return (
		<div id="scene-editor">
			<ObjectList objectList={sceneHelper.getVecpadObjectList()} sceneHelper={sceneHelper}/>
			<div id="scene-controls">
				<div>
					<select className="material-icons button-select add"  value={''} onChange={createObject}
						title="Add an object to the scene">
						<option>add</option>
						<optgroup label="3D Object">
							<option value={objectType.VECTOR}>Vector</option>
							<option value={objectType.TRIANGLE}>Triangle</option>
							<option value={objectType.QUAD}>Quad</option>
							<option value={objectType.CUBE}>Cube</option>
						</optgroup>
						<optgroup label="Vector operation">
							<option value={objectType.ADDITION}>Addition</option>
							<option value={objectType.SUBTRACTION}>Subtraction</option>
							<option value={objectType.CROSS}>Cross product</option>
						</optgroup>
					</select>
					<button className="material-icons text-only delete" onClick={sceneHelper.clearScene}
						title="Remove all objects from the scene">
						clear
					</button>
				</div>
				<div>
					<label id="file-chooser" htmlFor="file" className="material-icons" title="Load a scene from a file">
						open_in_browser
					</label>
					<input id="file" type="file" accept="application/json"
						onChange={(event) => sceneHelper.loadSceneFromFile(event.target.files)}
						onClick={(event) => event.target.value = null}/>
					<button className="material-icons text-only" onClick={sceneHelper.exportScene}
						title="Export the scene to a file">
						save_alt
					</button>
				</div>
			</div>
			<InputGroup name='Display Mode'>
				<select value={sceneHelper.currentDisplayMode}
					onChange={(event) => sceneHelper.applyDisplayMode(parseInt(event.target.value))}>
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
			<InputGroup name="Graph size">
				<input type="range" min="2" max="100" step="2" value={sceneHelper.THREEScene.graph.size}
					onChange={(event) => sceneHelper.updateGraphSize(parseInt(event.target.value))}/>
			</InputGroup>
			<div>
				<button onClick={cameraHelper.unfocusObject}>Unfollow objects</button>
			</div>
			<InputGroup name="Auto-Save">
				<input type="checkbox" checked={sceneHelper.autoSave} onChange={sceneHelper.updateAutoSave}/>
			</InputGroup>
			<div>
				<a href="https://github.com/Chabam/Vecpad">Source code</a>
				<span>|</span>
				<a href="https://github.com/Chabam/Vecpad/wiki">Wiki</a>
			</div>
		</div>
	);

};

export default SceneEditor;