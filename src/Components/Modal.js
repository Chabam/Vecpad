import React from 'react';

const Modal = ({visible, closeModal}) => {

    return (
        <div id="modal-container" className={visible ? 'visible' : 'hidden'}>
            <div id="modal-window">
                <div id="modal-header">
                    <p id="modal-title">EPIC MODAL WOW</p>
                    <span id="modal-close"onClick={closeModal}>&times;</span>
                </div>
            </div>
        </div>
    );
}

export default Modal;