import React from 'react';

const CoordinatesPicker = ({name, defaultX=0, defaultY=0, defaultZ=0}) => {
	const id = name.toLowerCase().replace(' ', '-');
	const names = {
		x: `${id}-x`,
		y: `${id}-y`,
		z: `${id}-z`
	}
	return (
		<div className="coordinates-picker">
			<label>{name} :</label>
			<input name={names.x} type="number" step={0.01} defaultValue={defaultX} required></input>
			<input name={names.y} type="number" step={0.01} defaultValue={defaultY} required></input>
			<input name={names.z} type="number" step={0.01} defaultValue={defaultZ} required></input>
		</div>
	);
}

export default CoordinatesPicker;