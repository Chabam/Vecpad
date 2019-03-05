import React from 'react';
import TransformationList from './TransformationList';

const TransformationEditor = ({object, openMatrixViewModal}) => {
    let stepPerTrans = 1 / (object.transformations.length);
    let currentTrans = Math.floor(object.currentStep / stepPerTrans);
	return (
        <div id="transformation-editor">
            <div id="transformation-slider">
                <p>0</p>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    onChange={(e) => object.applyTransformations(parseFloat(e.target.value))}
                    value={object.currentStep}/>
                <p>100</p>
            </div>
            <TransformationList
                transformationList={object.transformations}
                activeTransformation={Math.min(currentTrans, object.transformations.length - 1)}
                removeTransformation={object.removeTransformation}
                openMatrixViewModal={openMatrixViewModal}
            />
        </div>
	);
}

export default TransformationEditor;