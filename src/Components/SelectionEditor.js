import React from 'react';

// This component will show the specific details of the currently selected object
const SelectionEditor = ({name}) => {
    return (
            <div id="selection-editor">
                <h1>{name}</h1>
            </div>
        );
}

export default SelectionEditor;