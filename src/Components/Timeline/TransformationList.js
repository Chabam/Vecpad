import React from 'react';
import TransformationInfo from './TransformationInfo';

const TransformationList = ({transformationList, activeTransformation, updateTransformation, removeTransformation}) => {
	let transformations = transformationList.map((transformation, i) => (
		<TransformationInfo
			key={i}
			transformation={transformation}
			activeTransformation={i === activeTransformation}
			updateTransformation={updateTransformation}
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