import React from 'react';

/*
	This component will show the specific details of an operation.
*/
const OperationInfo = ({operation, removeOperation}) => {

	return (
		<div className="operation-info">
            <p>{operation.label}</p>
			<button onClick={() => removeOperation(operation)}>Remove</button>
		</div>
	);
}

export default OperationInfo;