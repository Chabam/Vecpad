import React, { Component } from 'react';
import THREEHelper from '../THREE/THREEHelper'

/*
	This component will be used to control common settings of the application.
	For exemple: the display mode, adding an object, undo and redo, etc.
*/
export default class Toolbar extends Component {
	render() {
		return (
			<nav id="toolbar">
				<div>
					Display Mode:
					<select onChange={this.updateDisplayMode} defaultValue={this.props.displayMode}>
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
					<button onClick={this.props.addBasicVector}>Add Vector</button>
					<button onClick={this.props.addBasicTriangle}>Add Triangle</button>
					<button onClick={this.props.addBasicQuad}>Add Quad</button>
					<button onClick={this.props.addBasicCube}>Add Cube</button>
				</div>
				<div>
					Current ground size: {this.props.groundSize}
					<input type="range" min="2" max="100" step="2" onChange={this.updateGround} value={this.props.groundSize}/>
				</div>
			</nav>
		);
	}

	updateDisplayMode = (event) => this.props.updateDisplayMode(parseInt(event.target.value));

	updateGround = (event) => this.props.updateGround(parseInt(event.target.value))
}