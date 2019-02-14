import React from 'react';

const Modal = ({title, content, closeModal}) => {

	return (
		<div id="modal-container" className={content ? 'visible' : 'hidden'}>
			<div id="modal-window">
				<div id="modal-header">
					<p id="modal-title">{title}</p>
					<span id="modal-close"onClick={closeModal}>&times;</span>
				</div>
				<div id="modal-content">
					{content}
				</div>
			</div>
		</div>
	);
}

export default Modal;