import React from 'react';

/*
	This component will show the specific details of a transformation.
*/
const TransformationInfo = ({transformation, removeTransformation, openMatrixViewModal}) => {

	return (
		<div className="transformation-info">
			<p>{transformation.name}</p>
			<div className='transformation-slider'>
				<p>0</p>
				<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					onChange={(e) => transformation.update(parseFloat(e.target.value))}
					value={transformation.currentStep}/>
				<p>100</p>
			</div>
			<button onClick={transformation.prioritize}>&uarr;</button>
			<button onClick={transformation.deprioritize}>&darr;</button>
			<button onClick={() => removeTransformation(transformation)}>Remove</button>
			<button onClick={() => openMatrixViewModal(transformation)}>View Matrix</button>
		</div>
	);
}

export default TransformationInfo;