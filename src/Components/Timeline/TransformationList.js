import React from 'react';
import TransformationInfo from './TransformationInfo';

const TransformationList = ({transformationList, activeTransformation, removeTransformation}) => {
	let transformations = transformationList.map((transformation, i) => (
		<TransformationInfo
			key={i}
			activeTransformation={i === activeTransformation}
			transformation={transformation}
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