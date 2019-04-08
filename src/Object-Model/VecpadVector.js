import React from 'react';
import * as THREE from 'three';
import VecpadObjectMixin from './VecpadObjectMixin';
import SceneHelper from './THREE/SceneHelper';
import CoordinatesPicker from '../Components/Inputs/CoordinatesPicker';
import InputGroup from '../Components/Inputs/InputGroup';

export default class VecpadVector extends THREE.Line {
	constructor(direction, color, label, updateSceneFunc) {
		let vectorGeometry = new THREE.Geometry();
		let origin = new THREE.Vector3(0, 0, 0);

		vectorGeometry.vertices.push(
			origin,
			direction
		);
		vectorGeometry.computeBoundingBox();
		// Tell THREE that the coordinates will change, this allow us to reuse the same object
		vectorGeometry.dynamic = true;

		// The line is created here
		super(vectorGeometry, new THREE.LineBasicMaterial({
			color: color
		}));

		this.type = 'Vector';

		// The arrow tip is created here
		let arrowGeometry = new THREE.ConeGeometry(0.05, 0.05, 10);
		let arrow = new THREE.Mesh(arrowGeometry, new THREE.MeshBasicMaterial({
			color: color
		}));

		this.arrow = arrow;
		this.add(arrow);

		this.vector = direction;
		this.originalVector = this.vector;
		this.normalize = false;

		this.alignArrowOnVector(direction);

		VecpadObjectMixin.call(this, label, updateSceneFunc);
	}

	computeTransformations = () => {
		this.matrix.copy(this.originalMatrix);

		let transMatrix = this.transformations.reduce((matrix, trans) =>
			trans.getMatrix().multiply(matrix),
		new THREE.Matrix4()
		);

		this.vector = this.normalize ? this.originalVector.clone().normalize() : this.originalVector.clone();
		this.vector.applyMatrix4(transMatrix);

		this.arrow.position.copy(origin);
		this.arrow.matrix = new THREE.Matrix4();
		this.alignArrowOnVector();

		this.geometry.vertices[1] = this.vector;
		this.geometry.verticesNeedUpdate = true;
		this.geometry.computeBoundingSphere();

		this.computeLabelPosition();
	}

	updateColor = (color) => {
		this.material.color.setHex(color);
		this.arrow.material.color.setHex(color);
		this.deselect();
		this.select();
		this.updateScene(true, [{
			uuid: this.uuid,
			valueName: 'color',
			value: color
		}]);
	}

	// Makes the vector pop when selected
	select = () => {
		this.label.element.classList.add('selected');

		this.renderOrder = 1;

		let { arrow, material } = this;
		material.linewidth = SceneHelper.SELECTED_LINEWIDTH;

		// Render vector on top of other objects
		arrow.renderOrder = 1;
		material.depthTest = false;
		arrow.material.depthTest = false;
	}

	// Reset the vector to its initial state
	deselect = () => {
		this.label.element.classList.remove('selected');

		this.renderOrder = 0;

		let { arrow, material } = this;
		material.linewidth = SceneHelper.UNSELECTED_LINEWIDTH;

		arrow.renderOrder = 0;
		material.depthTest = true;
		arrow.material.depthTest = true;
	}

	// Update to set wether or not to normalize the vector
	updateNormalize = () => {
		this.normalize = !this.normalize;

		this.applyTransformations(1);

		this.updateScene(true, [{
			uuid: this.uuid,
			valueName: 'normalize',
			value: this.normalize
		}]);
	}

	// Update the original vector
	updateVector = (direction) => {
		this.originalVector = direction.clone();

		this.applyTransformations(1);
		this.updateScene(false, [{
			uuid: this.uuid,
			valueName: 'originalVector',
			value: {
				x: this.originalVector.x,
				y: this.originalVector.y,
				z: this.originalVector.z
			}
		}]);
	}

	// Sets the cone on along the top of the vector
	alignArrowOnVector = () => {
		let up = new THREE.Vector3(0, 1, 0);

		if (this.vector === new THREE.Vector3()) {
			return;
		}

		let rotationAxis;
		let rotationAngle;
		let normalizedDirection = this.vector.clone().normalize();

		/*
			This code section aligns the vector object to the vector.
			If the vector we are trying to align to is exactly the opposite of our up vector
		*/
		if (normalizedDirection.equals(new THREE.Vector3(0, -1, 0))) {
			// We just flip the vector upside down
			rotationAxis = new THREE.Vector3(1, 0, 0);
			rotationAngle = Math.PI;
		} else {
			/*
				Otherwise we do the following:
					Rotation axis = V1 x V2
					Rotation angle = arccos(V1 * V2)
					Rotate the vector with the previous values.
			*/
			rotationAxis = new THREE.Vector3().crossVectors(up, normalizedDirection).normalize();
			rotationAngle = Math.acos(up.dot(normalizedDirection));
		}
		let rotationMatrix = new THREE.Matrix4().makeRotationAxis(rotationAxis, rotationAngle);

		this.arrow.applyMatrix(rotationMatrix);
		this.arrow.position.copy(this.vector);
	}

	clean = () => {
		this.notifyRegistreeOfDeletion();
		this.remove(this.label);

		this.geometry.dispose();
		this.material.dispose();
		this.arrow.geometry.dispose();
		this.arrow.material.dispose();
	}

	toJSON = () => ({
		uuid: this.uuid,
		name: this.name,
		type: this.type,
		color: this.material.color.getHex(),
		normalize: this.normalize,
		originalVector: {
			x: this.originalVector.x,
			y: this.originalVector.y,
			z: this.originalVector.z
		},
		transformations: this.transformations.reduce(
			(trans, currentTrans) => {
				trans.push(currentTrans.toJSON());
				return trans;
			},
			[]
		)
	});

	getCenter = () => this.vector.clone().multiplyScalar(1 / 2);

	getCoordinatesEditor = () => (
		<CoordinatesPicker
			name="Direction"
			coordinates={this.originalVector}
			updateCoordinates={this.updateVector}
		/>
	);

	getTypeSpecificControls = () => (
		<React.Fragment>
			<InputGroup name="Normalize">
				<input type="checkbox" checked={this.normalize} onChange={this.updateNormalize}/>
			</InputGroup>
		</React.Fragment>
	);
}
