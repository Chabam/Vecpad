import React from 'react';
import * as THREE from 'three';

const CoordinatesPicker = ({name, updateCoordinates, coordinates}) => {
	let {x, y, z} = coordinates;

	const updateX = (event) => updateCoordinates(new THREE.Vector3(parseFloat(event.target.value), y, z));
	const updateY = (event) => updateCoordinates(new THREE.Vector3(x, parseFloat(event.target.value), z));
	const updateZ = (event) => updateCoordinates(new THREE.Vector3(x, y, parseFloat(event.target.value)));
	return (
		<div className="coordinates-picker">
			<label>{name} :</label>
			<div className="coordinates">
				<input type="number" step={0.01} defaultValue={x} onChange={updateX}/>
				<input type="number" step={0.01} defaultValue={y} onChange={updateY}/>
				<input type="number" step={0.01} defaultValue={z} onChange={updateZ}/>
			</div>
		</div>
	);
}

export default CoordinatesPicker;