import React from 'react';
import InputGroup from './InputGroup';

const ColorPicker = ({name, updateColor, defaultColor=0x000000}) => {
	const callUpdateColor = (event) => updateColor(parseInt(event.target.value));
	return <InputGroup name={name}>
		<select value={defaultColor} onChange={callUpdateColor}>
			<option value={0x000000}>Black</option>
			<option value={0xffffff}>White</option>
			<option value={0xff0000}>Red</option>
			<option value={0x00ff00}>Green</option>
			<option value={0x0000ff}>Blue</option>
		</select>
	</InputGroup>;
}

export default ColorPicker;