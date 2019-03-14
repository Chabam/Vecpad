import React from 'react';
import InputGroup from '../Inputs/InputGroup'
import CoordinatesPicker from '../Inputs/CoordinatesPicker'

/*
	This component will show the specific details of a transformation.
*/
const TransformationInfo = ({transformation, activeTransformation, removeTransformation}) => {
	const updateTransformationValue = (valueName, value) => {
		transformation[valueName] = value;

		transformation.applyTransformations(1);
		transformation.updateReact();
	};

	const updateX = (event) => updateTransformationValue('x', parseFloat(event.target.value));
	const updateY = (event) => updateTransformationValue('y', parseFloat(event.target.value));
	const updateZ = (event) => updateTransformationValue('z', parseFloat(event.target.value));
	const updateXY = (event) => updateTransformationValue('xY', parseFloat(event.target.value));
	const updateXZ = (event) => updateTransformationValue('xZ', parseFloat(event.target.value));
	const updateYX = (event) => updateTransformationValue('yX', parseFloat(event.target.value));
	const updateYZ = (event) => updateTransformationValue('yZ', parseFloat(event.target.value));
	const updateZX = (event) => updateTransformationValue('zX', parseFloat(event.target.value));
	const updateZY = (event) => updateTransformationValue('zY', parseFloat(event.target.value));
	const updateAngle = (event) => updateTransformationValue('angle', parseFloat(event.target.value));

	let controls;
	switch(transformation.name) {
		case 'Scale':
		case 'Translation':
			let { x, y, z} = transformation;

			controls = (
				<div className="transformation-controls">
					<InputGroup name="Amount X">
						<input type="number" step={0.01} defaultValue={x} onChange={updateX}/>
					</InputGroup>
					<InputGroup name="Amount Y">
						<input type="number" step={0.01} defaultValue={y} onChange={updateY}/>
					</InputGroup>
					<InputGroup name="Amount Z">
						<input type="number" step={0.01} defaultValue={z} onChange={updateZ}/>
					</InputGroup>
				</div>
			);
			break;
		case 'Rotation':
			let { axis, angle } = transformation;
			controls = (
				<div className="transformation-controls">
					<CoordinatesPicker
						name="Axis"
						updateCoordinates={(axis) => updateTransformationValue('axis', axis)}
						coordinates={axis}
					/>
					<InputGroup name="Angle">
						<input type="number" step={0.01} defaultValue={angle} onChange={updateAngle}/>
					</InputGroup>
				</div>
			);
			break;
		case 'Shear':
			let { xY, xZ, yX, yZ, zX, zY } = transformation;
			controls = (
				<div className="transformation-controls">
					<InputGroup name="Amount XY">
						<input type="number" step={0.01} defaultValue={xY} onChange={updateXY}/>
					</InputGroup>
					<InputGroup name="Amount XZ">
						<input type="number" step={0.01} defaultValue={xZ} onChange={updateXZ}/>
					</InputGroup>
					<InputGroup name="Amount YX">
						<input type="number" step={0.01} defaultValue={yX} onChange={updateYX}/>
					</InputGroup>
					<InputGroup name="Amount YZ">
						<input type="number" step={0.01} defaultValue={yZ} onChange={updateYZ}/>
					</InputGroup>
					<InputGroup name="Amount ZX">
						<input type="number" step={0.01} defaultValue={zX} onChange={updateZX}/>
					</InputGroup>
					<InputGroup name="Amount ZY">
						<input type="number" step={0.01} defaultValue={zY} onChange={updateZY}/>
					</InputGroup>
				</div>
			);
			break;
		default:
			controls = (
				<div className="transformation-controls">
					No transformation
				</div>
			);
			break;
	}

	const TransformationActionType = {
		PRIORITIZE: 0,
		DEPRIORITIZE: 1,
		REMOVE: 2
	}

	const handleTransformationAction = (event) => {
		switch (parseInt(event.target.value)) {
			case TransformationActionType.PRIORITIZE:
				transformation.prioritize();
				break;
			case TransformationActionType.DEPRIORITIZE:
				transformation.deprioritize();
				break;
			case TransformationActionType.REMOVE:
				removeTransformation(transformation);
				break;
		}
	}

	return (
		<div className={`transformation-info ${activeTransformation ? 'active' :  ''}`}>
			<h2>{transformation.name}</h2>
			<select className="button-select" value={''} onChange={handleTransformationAction}>
				<option>☰</option>
				<option value={TransformationActionType.PRIORITIZE}>To the left</option>
				<option value={TransformationActionType.DEPRIORITIZE}>To the right</option>
				<option value={TransformationActionType.REMOVE}>Remove</option>
			</select>
			{controls}
		</div>
	);
}

export default TransformationInfo;