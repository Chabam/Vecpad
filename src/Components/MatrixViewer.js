import React from 'react';
import { Node, Context } from 'react-mathjax2';
import Translation from '../Transformations/Translation';
import Scale from '../Transformations/Scale';
import Shear from '../Transformations/Shear';
import Rotation from '../Transformations/Rotation';
import THREEHelper from '../THREE/THREEHelper';

const MatrixViewer = ({transformation}) => {
	let explanation = 'Something went wrong (the transformation is not recongnized)!';
	if (transformation instanceof Translation) {
		const matrixDefinition = 'T = [[1,0,0,Delta_x],[0,1,0,Delta_y],[0,0,1,Delta_z],[0,0,0,1]]';
		explanation = (
			<div>
				<p>
					The matrix describing a translation goes as follows :
				</p>
				<Node>{matrixDefinition}</Node>
				<p>With the values we now have : </p>
				<Node>{transformation.viewMatrix()}</Node>
			</div>
		);
	} else if (transformation instanceof Scale) {
		const matrixDefinition = 'S = [[Delta_x,0,0,0],[0,Delta_y,0,0],[0,0,Delta_z,1],[0,0,0,1]]';
		explanation = (
			<div>
				<p>
					The matrix describing a scaling goes as follows :
				</p>
				<Node>{matrixDefinition}</Node>
				<p>With the values we now have : </p>
				<Node>{transformation.viewMatrix()}</Node>
			</div>
		);
	} else if (transformation instanceof Shear) {
		const matrixDefinition = 'Sh = [[1,Delta_x^y,Delta_x^z,0],[Delta_y^x,1,Delta_y^z,0],[Delta_z^x,Delta_z^y,1,0],[0,0,0,1]]';
		explanation = (
			<div>
				<p>
					The matrix describing a shearing goes as follows :
				</p>
				<Node>{matrixDefinition}</Node>
				<p><Node inline>{'Delta_x^y'}</Node> denotes how <b>Y</b> affects <b>X</b></p>
				<p>With the values we now have : </p>
				<Node>{transformation.viewMatrix()}</Node>
			</div>
		);
	} else if (transformation instanceof Rotation) {
		const xMatrixDefinition = 'R(theta)_x = [[1,0,0,0],[0,cos theta,-sin theta,0],[0,sin theta,cos theta,0],[0,0,0,1]]';
		const yMatrixDefinition = 'R(theta)_y = [[cos theta,0,sin theta,0],[0,1,0,0],[-sin theta,0,cos theta,0],[0,0,0,1]]';
		const zMatrixDefinition = 'R(theta)_z = [[cos theta,-sin theta,0,0],[sin theta,cos theta,0,0],[0,0,1,0],[0,0,0,1]]';
		let {angle, currentStep} = transformation;
		explanation = (
			<div>
				<p>Rotation uses three different matrices, one for each axis :</p>
				<Node>{xMatrixDefinition}</Node>
				<br/>
				<Node>{yMatrixDefinition}</Node>
				<br/>
				<Node>{zMatrixDefinition}</Node>
				<p>Combined and with the values we now have : </p>
				<Node>{`R(${THREEHelper.displayFloat(angle * currentStep)}) = ${transformation.viewMatrix()}`}</Node>
			</div>
		);
	}
	return (
		<Context input="ascii" script="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=AM_SVG">
			{explanation}
		</Context>
	);
}

export default MatrixViewer;