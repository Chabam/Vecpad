import React from 'react';

const InputGroup = ({name, children}) => {
	return (
		<div className="input-group">
			<label>{name} :</label>
			{children}
		</div>
	);
}

export default InputGroup;