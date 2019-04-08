import React from 'react';

const InputGroup = ({name, children}) => {
	return (
		<div className="input-group">
			<label>{name} :</label>
			<div className="input-container">
				{children}
			</div>
		</div>
	);
};

export default InputGroup;