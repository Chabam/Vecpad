import React from 'react';
import OperationInfo from '../Sidebar/OperationInfo';

const OperationList = ({operationList, removeOperation, openOperationModal}) => {
	let operations = operationList.map((operation, i) => (
		<OperationInfo
			key={i}
			operation={operation}
			removeOperation={removeOperation}
		/>
	));

	return (
	<div id="operation-list">
        <button onClick={openOperationModal}>Add Operation</button>
		{operations}
	</div>
	);
}

export default OperationList;