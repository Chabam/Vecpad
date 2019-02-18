import React from 'react';
import TransformationInfo from './TransformationInfo';

const TransformationList = ({transformationList, removeTransformation, openMatrixViewModal}) => {
	let transformations = transformationList.map((transformation, i) => (
		<TransformationInfo
			key={i}
			transformation={transformation}
			removeTransformation={removeTransformation}
			openMatrixViewModal={openMatrixViewModal}
		/>
	));

	return (
	<div id="transformation-list">
		{transformations}
	</div>
	);
}

export default TransformationList;