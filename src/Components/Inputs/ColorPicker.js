import React from 'react';
import InputGroup from './InputGroup';

const ColorPicker = ({name, defaultColor=0x000000}) => {
	const id = name.toLowerCase().replace(' ', '-');
	return <InputGroup name={name} id={id}>
		<select name={id} defaultValue={defaultColor} placeholder={name}>
			<option value={0x000000}>Black</option>
			<option value={0xffffff}>White</option>
			<option value={0xff0000}>Red</option>
			<option value={0x00ff00}>Green</option>
			<option value={0x0000ff}>Blue</option>
		</select>
	</InputGroup>;
}

export default ColorPicker;