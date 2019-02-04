import React, { Component } from 'react';
import THREEHelper from '../THREE/THREEHelper'

export default class Toolbar extends Component {
	constructor(props) {
		super(props);
		this.updateDisplayMode = this.updateDisplayMode.bind(this);
	}
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
					<button onClick={this.props.addBasicTriangle}>Add Triangle</button>
					<button onClick={this.props.addBasicQuad}>Add Quad</button>
					<button onClick={this.props.addBasicCube}>Add Cube</button>
				</div>
			</nav>
		);
	}

	updateDisplayMode(event) {
		this.props.updateDisplayMode(parseInt(event.target.value));
	}
}