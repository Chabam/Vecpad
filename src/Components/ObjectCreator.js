import React, {Component} from 'react';

export default class ObjectCreator extends Component {

	static ObjectType = {
		Vector: 0,
		Triangle: 1,
		Quad: 2,
		Cube: 3,
	}

	constructor(props) {
		super(props);
		this.state = {
			ObjectType: null
		}
	}

	render() {
		let { objectType } = this.state;

		return (
			<form>
				<select onChange={this.changeObjectType}>
					<option></option>
					<option value={ObjectCreator.ObjectType.Vector}>
						Vector
					</option>
					<option value={ObjectCreator.ObjectType.Triangle}>
						Triangle
					</option>
					<option value={ObjectCreator.ObjectType.Quad}>
						Quad
					</option>
					<option value={ObjectCreator.ObjectType.Cube}>
						Cube
					</option>
				</select>
				{this.renderForm(objectType)}
			</form>
		);
	}

	changeObjectType = (event) => this.setState({
		objectType: parseInt(event.target.value)
	});

	renderForm = (objectType) => {
		switch(objectType) {
			case ObjectCreator.ObjectType.Vector:
				return (
					<div>
						Vector
					</div>
				);
			case ObjectCreator.ObjectType.Triangle:
			return (
				<div>
					Triangle
				</div>
			);
			case ObjectCreator.ObjectType.Quad:
			return (
				<div>
					Quad
				</div>
			);
			case ObjectCreator.ObjectType.Cube:
			return (
				<div>
					Cube
				</div>
			);
			default:
				return (<div></div>);
		}
	}


}