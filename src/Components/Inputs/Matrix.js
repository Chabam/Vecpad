import React from 'react';
import THREEHelper from '../../Object-Model/THREE/THREEHelper';


const Matrix = ({matrix}) => {
	let matrixList = matrix.toArray();
	return (
		<table className="matrix">
			<tbody>
				<tr>
					<td>{THREEHelper.displayFloat(matrixList[0])}</td>
					<td>{THREEHelper.displayFloat(matrixList[4])}</td>
					<td>{THREEHelper.displayFloat(matrixList[8])}</td>
					<td>{THREEHelper.displayFloat(matrixList[12])}</td>
				</tr>
				<tr>
					<td>{THREEHelper.displayFloat(matrixList[1])}</td>
					<td>{THREEHelper.displayFloat(matrixList[5])}</td>
					<td>{THREEHelper.displayFloat(matrixList[9])}</td>
					<td>{THREEHelper.displayFloat(matrixList[13])}</td>
				</tr>
				<tr>
					<td>{THREEHelper.displayFloat(matrixList[2])}</td>
					<td>{THREEHelper.displayFloat(matrixList[6])}</td>
					<td>{THREEHelper.displayFloat(matrixList[10])}</td>
					<td>{THREEHelper.displayFloat(matrixList[14])}</td>
				</tr>
				<tr>
					<td>{THREEHelper.displayFloat(matrixList[3])}</td>
					<td>{THREEHelper.displayFloat(matrixList[7])}</td>
					<td>{THREEHelper.displayFloat(matrixList[11])}</td>
					<td>{THREEHelper.displayFloat(matrixList[15])}</td>
				</tr>
			</tbody>
		</table>
	);
};

export default Matrix;