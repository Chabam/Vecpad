import React, {Component} from 'react';
import CoordinatesPicker from './CoordinatesPicker';
import InputGroup from './InputGroup';

export default class TransformationCreator extends Component {

	static TransformationType = {
		Translation: 0,
		Rotation: 1
	}

	constructor(props) {
		super(props);
		this.state = {
			transformationType: null
		}
		this.object = props.object;
		this.closeModal = props.closeModal;
	}

	render() {
		let { transformationType } = this.state;

		return (
			<div>
				<InputGroup name="Transformation type" id="Transformation-type">
					<select onChange={this.changeTransformationType}>
						<option></option>
						<option value={TransformationCreator.TransformationType.Translation}>
							Translation
						</option>
						<option value={TransformationCreator.TransformationType.Rotation}>
							Rotation
						</option>
					</select>
				</InputGroup>
				{this.renderTransformationForm(transformationType)}
			</div>
		);
	}

	changeTransformationType = (event) => this.setState({
		transformationType: parseInt(event.target.value)
	});

	renderTransformationForm = (transformationType) => {
		switch(transformationType) {
			case TransformationCreator.TransformationType.Translation:
				return (
					<form onSubmit={this.callAddTranslation}>
						<CoordinatesPicker name="Direction" defaultX={0} defaultY={0} defaultZ={0}/>
						<button type="submit">Add</button>
					</form>
				);
			case TransformationCreator.TransformationType.Rotation:
			return (
				<div>Rotation</div>
			);

			default:
				return (<div>No type selected!</div>);
		}
	}

	callAddTranslation = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);

		this.object.addTranslation(
			parseFloat(data.get('direction-x')),
			parseFloat(data.get('direction-y')),
			parseFloat(data.get('direction-z'))
		);
		this.closeModal();
	}

}