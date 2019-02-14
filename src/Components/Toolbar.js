import React from 'react';
import THREEHelper from '../THREE/THREEHelper'
import logo from '../Images/logo.svg'

/*
	This component will be used to control common settings of the application.
	For exemple: the display mode, adding an object, undo and redo, etc.
*/
const Toolbar = ({updateDisplayMode, updateGround, displayMode, groundSize, addObject}) => {
	const callUpdateDisplayMode = (event) => updateDisplayMode(parseInt(event.target.value));

	const callUpdateGround = (event) => updateGround(parseInt(event.target.value));

	return (
		<nav id="toolbar">
			<div id='logo'>
				<img src={logo} alt={'Vecpad\'s logo'}></img>
			</div>
			<div>
				Display Mode:
				<select onChange={callUpdateDisplayMode} defaultValue={displayMode}>
					<option value={THREEHelper.OUTLINE}>
						Outline
					</option>
					<option value={THREEHelper.FILL}>
						Fill
					</option>
					<option value={THREEHelper.BOTH}>
						Both
					</option>
				</select>
			</div>
			<div>
				<button onClick={addObject}>Add an object</button>
			</div>
			<div>
				Current ground size: {groundSize}
				<input type="range" min="2" max="100" step="2" onChange={callUpdateGround} value={groundSize}/>
			</div>
		</nav>
	);
}

export default Toolbar;