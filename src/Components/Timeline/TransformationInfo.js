import React from 'react';
import InputGroup from '../Inputs/InputGroup'
import CoordinatesPicker from '../Inputs/CoordinatesPicker'

/*
	This component will show the specific details of a transformation.
*/
const TransformationInfo = ({transformation, activeTransformation, updateTransformation, removeTransformation}) => {
	const updateTransformationValue = (event, valueName) => updateTransformation({
		transformation,
		name: valueName,
		value: parseFloat(event.target.value)
	});

	const updateX = (event) => updateTransformationValue(event, 'x');
	const updateY = (event) => updateTransformationValue(event, 'y');
	const updateZ = (event) => updateTransformationValue(event, 'z');
	const updateXY = (event) => updateTransformationValue(event, 'xY');
	const updateXZ = (event) => updateTransformationValue(event, 'xZ');
	const updateYX = (event) => updateTransformationValue(event, 'yX');
	const updateYZ = (event) => updateTransformationValue(event, 'yZ');
	const updateZX = (event) => updateTransformationValue(event, 'zX');
	const updateZY = (event) => updateTransformationValue(event, 'zY');
	const updateAxis = (axis) => updateTransformation({
		transformation,
		name: 'axis',
		value: axis
	});
	const updateAngle = (event) => updateTransformationValue(event, 'angle');

	let controls;
	switch(transformation.name) {
		case 'Scale':
		case 'Translation':
			let { x, y, z} = transformation;

			controls = (
				<div className="transformation-controls">
					<InputGroup name="Amount X">
						<input type="number" step={0.01} value={x} onChange={updateX}/>
					</InputGroup>
					<InputGroup name="Amount Y">
						<input type="number" step={0.01} value={y} onChange={updateY}/>
					</InputGroup>
					<InputGroup name="Amount Z">
						<input type="number" step={0.01} value={z} onChange={updateZ}/>
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
						updateCoordinates={updateAxis}
						coordinates={axis}
					/>
					<InputGroup name="Angle">
						<input type="number" step={0.01} value={angle} onChange={updateAngle}/>
					</InputGroup>
				</div>
			);
			break;
		case 'Shear':
			let { xY, xZ, yX, yZ, zX, zY } = transformation;
			controls = (
				<div className="transformation-controls">
					<InputGroup name="Amount XY">
						<input type="number" step={0.01} value={xY} onChange={updateXY}/>
					</InputGroup>
					<InputGroup name="Amount XZ">
						<input type="number" step={0.01} value={xZ} onChange={updateXZ}/>
					</InputGroup>
					<InputGroup name="Amount YX">
						<input type="number" step={0.01} value={yX} onChange={updateYX}/>
					</InputGroup>
					<InputGroup name="Amount YZ">
						<input type="number" step={0.01} value={yZ} onChange={updateYZ}/>
					</InputGroup>
					<InputGroup name="Amount ZX">
						<input type="number" step={0.01} value={zX} onChange={updateZX}/>
					</InputGroup>
					<InputGroup name="Amount ZY">
						<input type="number" step={0.01} value={zY} onChange={updateZY}/>
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

	return (
		<div className={`transformation-info ${activeTransformation ? 'active' :  ''}`}>
			<h2>{transformation.name}</h2>
			{controls}
			<div className="transformation-list-controls">
				<button className="prioritize text-only" onClick={transformation.prioritize}>&lt;</button>
				<button className="delete text-only"  onClick={() => removeTransformation(transformation)}>−</button>
				<button className="deprioritize text-only" onClick={transformation.deprioritize}>&gt;</button>
			</div>
		</div>
	);
}

export default TransformationInfo;