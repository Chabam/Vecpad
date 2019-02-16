import React from 'react';
import InputGroup from './InputGroup';

/*
	This component will show the specific details of a transformation.
*/
const TransformationInfo = ({transformation, applyTransformation, removeTransformation}) => {
	const callApplyTransformation = (event) => applyTransformation(transformation.uuid, parseFloat(event.target.value));

	const callRemoveTransformation = () => removeTransformation(transformation.uuid);
	return (
		<div className="transformation-info">
			<p>{transformation.name}</p>
			<div className='transformation-slider'>
				<p>0</p>
				<input name={`step-${transformation.uuid}`} type="range" min="0" max="1" step="0.01" onChange={callApplyTransformation} value={transformation.currentStep}/>
				<p>100</p>
			</div>
			<button onClick={callRemoveTransformation}>Remove</button>
		</div>
	);
}

export default TransformationInfo;