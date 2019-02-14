import React from 'react';

const InputGroup = ({name, id, children}) => {
	return (
		<div className="input-group">
			<label htmlFor={id}>{`${name} :`}</label>
			{children}
		</div>
	);
}

export default InputGroup;