import React, {Component} from 'react';
import InputGroup from '../Inputs/InputGroup';
import ColorPicker from '../Inputs/ColorPicker';

export default class OperationCreator extends Component {

	static OperationType = {
		Cross: 0,
		Addition: 1,
		Subtraction: 2
	}

	constructor(props) {
		super(props);
		this.state = {
			operationType: null,
			selectedVector: null
		}
		this.sceneHelper = this.props.sceneHelper;
		this.vector = props.vector;
		this.otherVectors = this.sceneHelper.getVectors().filter((v) => v !== this.vector);
		this.closeModal = props.closeModal;
	}

	render() {
		let { operationType } = this.state;
		let submitFunction;
		switch(operationType) {
			case OperationCreator.OperationType.Cross:
				submitFunction = this.createCross
				break;
			case OperationCreator.OperationType.Addition:
				submitFunction = this.createAdd
				break;
			case OperationCreator.OperationType.Subtraction:
				submitFunction = this.createSub
				break;
			default:
				submitFunction = () => {};
		}

		let vectorOptions = this.otherVectors.map((vector, i) => {
			return <option key={i} value={i}>{vector.name}</option>
		});

		return (
			<div>
				<form onSubmit={submitFunction}>
					<InputGroup name="operation type" id="operation-type">
						<select onChange={this.changeOperationType}>
							<option></option>
							<option value={OperationCreator.OperationType.Cross}>
								Cross product
							</option>
							<option value={OperationCreator.OperationType.Addition}>
								Addition
							</option>
							<option value={OperationCreator.OperationType.Subtraction}>
								Subtraction
							</option>
						</select>
					</InputGroup>
					<InputGroup name="Select another vector" id="other-vector">
						<select name="other-vector" onChange={this.changeSelectedVector} required>
							<option></option>
							{vectorOptions}
						</select>
					</InputGroup>
					<ColorPicker name="color"/>
					<InputGroup name="Name" id="name">
						<input name="name"/>
					</InputGroup>
					<button type="submit">Add</button>
				</form>
			</div>
		);
	}

	changeOperationType = (event) => this.setState({
		operationType: parseInt(event.target.value)
	});

	changeSelectedVector = (event) => {
		event.persist();
		this.setState((state) => ({
			...state,
			selectedVector: this.otherVectors[parseInt(event.target.value)]
		}));
	}

	createCross = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);

		let name = data.get('name');
		let color = parseInt(data.get('color'));

		this.sceneHelper.addCrossProduct(this.vector, this.state.selectedVector, color, name);
		this.closeModal();
	}

	createAdd = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);

		let name = data.get('name');
		let color = parseInt(data.get('color'));

		this.sceneHelper.addVectorAddition(this.vector, this.state.selectedVector, color, name);
		this.closeModal();
	}

	createSub = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);

		let name = data.get('name');
		let color = parseInt(data.get('color'));

		this.sceneHelper.addVectorSubtraction(this.vector, this.state.selectedVector, color, name);
		this.closeModal();
	}
}