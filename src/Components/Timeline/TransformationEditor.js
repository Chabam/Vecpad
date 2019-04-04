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
		<div id="transformations-editor" key={object.uuid}>
			<div id="transformation-list-container">
				<div id="transformations-controls">
					<button className="material-icons text-only add" onClick={object.play}>play_arrow</button>
					<button className="material-icons text-only" onClick={object.pause}>pause</button>
					<input
						id="transformations-slider"
						type="range"
						min="0"
						max="1"
						step="0.01"
						onChange={(e) => object.applyTransformations(parseFloat(e.target.value))}
						value={object.currentStep}
					/>
				</div>
				<TransformationList
					transformationList={object.transformations}
					activeTransformation={Math.min(currentTrans, object.transformations.length - 1)}
					removeTransformation={object.removeTransformation}
				/>
			</div>
			<div id="add-clear-transformation">
				<select className="material-icons button-select add" value={''} onChange={createTransformation}>
					<option>add</option>
					{
						object.type !== 'Vector' &&
						<option value={transformationType.TRANSLATION}>Translation</option>
					}
					<option value={transformationType.ROTATION}>Rotation</option>
					<option value={transformationType.SHEAR}>Shear</option>
					<option value={transformationType.SCALE}>Scale</option>
				</select>
				<button className="material-icons text-only delete" onClick={object.clearTransformations}>clear</button>
			</div>
		</div>
	);
}

export default TransformationEditor;