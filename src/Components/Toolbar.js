import React from 'react';
import THREEHelper from '../THREE/THREEHelper'
import logo from '../Images/logo.svg'
import InputGroup from './InputGroup';

/*
	This component will be used to control common settings of the application.
	For exemple: the display mode, adding an object, undo and redo, etc.
*/
const Toolbar = ({updateDisplayMode, updateGround, displayMode, groundSize, addObject, resetCamera}) => {
	const callUpdateDisplayMode = (event) => updateDisplayMode(parseInt(event.target.value));

	const callUpdateGround = (event) => updateGround(parseInt(event.target.value));

	return (
		<nav id="toolbar">
			<div id='logo'>
				<img src={logo} alt={'Vecpad\'s logo'}></img>
			</div>
			<div>
				<InputGroup name='Display Mode' id='display-mode'>
					<select name='display-mode' onChange={callUpdateDisplayMode} defaultValue={displayMode}>
						<option value={THREEHelper.DisplayMode.OUTLINE}>
							Outline
						</option>
						<option value={THREEHelper.DisplayMode.FILL}>
							Fill
						</option>
						<option value={THREEHelper.DisplayMode.BOTH}>
							Both
						</option>
					</select>
				</InputGroup>
			</div>
			<div>
				<button onClick={addObject}>Add an object</button>
			</div>
			<div>
				<button onClick={resetCamera}>Reset camera</button>
			</div>
			<div>
				<InputGroup name={`Ground size (${groundSize})`} id='ground-size'>
					<input name='ground-size' type="range" min="2" max="100" step="2" onChange={callUpdateGround} value={groundSize}/>
				</InputGroup>
			</div>
		</nav>
	);
}

export default Toolbar;