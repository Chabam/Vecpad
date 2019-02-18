import React from 'react';

const CoordinatesPicker = ({name, defaultX=0, defaultY=0, defaultZ=0}) => {
	const id = name.toLowerCase().replace(' ', '-');
	const names = {
		x: `${id}-x`,
		y: `${id}-y`,
		z: `${id}-z`
	}
	return (
		<fieldset>
			<legend>{name}</legend>
			<label htmlFor={names.x}>X :</label>
			<input name={names.x} type="number" step={0.01} defaultValue={defaultX} required></input>
			<label htmlFor={names.y}>Y :</label>
			<input name={names.y} type="number" step={0.01} defaultValue={defaultY} required></input>
			<label htmlFor={names.z}>Z :</label>
			<input name={names.z} type="number" step={0.01} defaultValue={defaultZ} required></input>
		</fieldset>
	);
}

export default CoordinatesPicker;