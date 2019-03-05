import React from 'react';

const Modal = ({title, children, closeModal}) => {

	return (
		<div id="modal-container" className={children ? 'visible' : 'hidden'}>
			<div id="modal-window">
				<div id="modal-header">
					<p id="modal-title">{title}</p>
					<span id="modal-close"onClick={closeModal}>&times;</span>
				</div>
				<div id="modal-content">
					{children}
				</div>
			</div>
		</div>
	);
}

export default Modal;