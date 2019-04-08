import React from 'react';
import Matrix from '../Inputs/Matrix';

const TransformationActionType = {
	PRIORITIZE: 0,
	DEPRIORITIZE: 1,
	REMOVE: 2
};

// This component will show the specific details of a transformation.
const TransformationInfo = ({transformation, activeTransformation, removeTransformation}) => {
	const toggleMatrix = () => {
		transformation.showMatrix = !transformation.showMatrix;
		transformation.updateScene();
	};

	const handleTransformationAction = (event) => {
		switch (parseInt(event.target.value)) {
		case TransformationActionType.PRIORITIZE:
			transformation.prioritize();
			break;
		case TransformationActionType.DEPRIORITIZE:
			transformation.deprioritize();
			break;
		case TransformationActionType.REMOVE:
			removeTransformation(transformation);
			break;
		default:
			event.preventDefault();
			break;
		}
	};

	// A button to show the expandability of the matrix.
	let matrixToggle = transformation.showMatrix
		? (<span className="material-icons">expand_less</span>)
		: (<span className="material-icons">expand_more</span>);


	return (
		<div className={`transformation-info ${activeTransformation ? 'active' :  ''}`} key={transformation.uuid}>
			<h2>{transformation.name}</h2>
			<select className="material-icons button-select" value={''} onChange={handleTransformationAction}>
				<option>menu</option>
				<option value={TransformationActionType.PRIORITIZE}>To the left</option>
				<option value={TransformationActionType.DEPRIORITIZE}>To the right</option>
				<option value={TransformationActionType.REMOVE}>Remove</option>
			</select>
			{transformation.getControls()}
			<div className="matrix-tooltip">
				<h2 onClick={toggleMatrix}>Matrix{matrixToggle}</h2>
				<div className={`matrix-container ${transformation.showMatrix ? 'visible' : ''}`}>
					<Matrix matrix={transformation.getMatrix()}/>
				</div>
			</div>
		</div>
	);
};

export default TransformationInfo;