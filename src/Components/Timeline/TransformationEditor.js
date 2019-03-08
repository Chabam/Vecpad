import React from 'react';
import TransformationList from './TransformationList';

const TransformationEditor = ({object}) => {
    let stepPerTrans = 1 / (object.transformations.length);
    let currentTrans = Math.floor(object.currentStep / stepPerTrans);

    const transformationType = {
		TRANSLATION: 0,
		ROTATION: 1,
		SHEAR: 2,
		SCALE: 3
	}

	const createTransformation = (event) => {
		switch(parseInt(event.target.value)) {
			case transformationType.TRANSLATION:
				object.addTranslation();
				break;
			case transformationType.ROTATION:
				object.addRotation();
				break;
			case transformationType.SHEAR:
				object.addShear();
				break;
			case transformationType.SCALE:
				object.addScale();
				break;
			default:
				event.preventDefault();
				break;
        }
    }

	return (
        <div id="transformation-editor">
            <div id="transformation-controls">
                <h1>Timeline</h1>
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
            </div>
            <div id="transformation-list-container">
                <TransformationList
                    transformationList={object.transformations}
                    activeTransformation={Math.min(currentTrans, object.transformations.length - 1)}
                    removeTransformation={object.removeTransformation}
                />
                <div id="add-transformation">
                    <select className="add-select" value={''} onChange={createTransformation}>
                        <option>＋</option>
                        {
                            object.type !== 'Vector' &&
                            <option value={transformationType.TRANSLATION}>Translation</option>
                        }
                        <option value={transformationType.ROTATION}>Rotation</option>
                        <option value={transformationType.SHEAR}>Shear</option>
                        <option value={transformationType.SCALE}>Scale</option>
                    </select>
                </div>
            </div>
        </div>
	);
}

export default TransformationEditor;