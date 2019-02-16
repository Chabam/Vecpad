import React from 'react';
import TransformationInfo from './TransformationInfo';

const TransformationList = ({transformationList, applyTransformation, removeTransformation}) => {
	let transformations = transformationList.map((transformation, i) => (
		<TransformationInfo
			key={i}
			transformation={transformation}
			applyTransformation={applyTransformation}
			removeTransformation={removeTransformation}
		/>
	));

	return (
	<div id="transformation-list">
		{transformations}
	</div>
	);
}

export default TransformationList;