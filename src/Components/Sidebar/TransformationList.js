import React from 'react';
import TransformationInfo from '../Sidebar/TransformationInfo';

const TransformationList = ({transformationList, activeTransformation, removeTransformation, openMatrixViewModal}) => {
	let transformations = transformationList.map((transformation, i) => (
		<TransformationInfo
			key={i}
			activeTransformation={i === activeTransformation}
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