import React from 'react';

/*
	This component will show the specific details of a transformation.
*/
const TransformationInfo = ({transformation, activeTransformation, removeTransformation, openMatrixViewModal}) => {

	return (
		<div className={`transformation-info ${activeTransformation ? 'active' : ''}`}>
			<p>{transformation.name}</p>
			<button onClick={transformation.prioritize}>&uarr;</button>
			<button onClick={transformation.deprioritize}>&darr;</button>
			<button onClick={() => removeTransformation(transformation)}>Remove</button>
			<button onClick={() => openMatrixViewModal(transformation)}>View Matrix</button>
		</div>
	);
}

export default TransformationInfo;