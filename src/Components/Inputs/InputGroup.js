import React from 'react';

// A simple component used to render an input paired with a label.
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