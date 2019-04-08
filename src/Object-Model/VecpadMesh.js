import React from 'react';
import * as THREE from 'three';
import SceneHelper from './THREE/SceneHelper';
import VecpadObjectMixin from './VecpadObjectMixin';
import Translation from './Transformations/Translation';
import CoordinatesPicker from '../Components/Inputs/CoordinatesPicker';


// A class representing all the 3D objects in Vecpad.
export default class VecpadMesh extends THREE.Mesh {
	constructor(geometry, type, displayMode, color, outlineColor, label, updateSceneFunc) {
		// The conventional mesh is created here
		super(geometry, new THREE.MeshLambertMaterial({
			color: color,
			side: THREE.DoubleSide,
			visible: displayMode !== SceneHelper.DisplayMode.OUTLINE
		}));

		this.type = type;
		this.originalPosition = this.position.clone();

		// The outline of the object
		let edgesGeometry = new THREE.EdgesGeometry(geometry);
		this.outline = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({
			color: outlineColor,
			visible: displayMode !== SceneHelper.DisplayMode.FILL
		}));
		this.add(this.outline);

		// Adding Vecpad utilities as a mixin
		VecpadObjectMixin.call(this, label, updateSceneFunc);
	}

	computeTransformations = () => {
		let transMatrix = this.transformations.reduce(
			(matrix, trans) => trans.getMatrix().multiply(matrix),
			new THREE.Matrix4()
		);

		// Reset to inital state
		this.matrix.copy(this.originalMatrix);
		this.applyMatrix(transMatrix);

		this.computeLabelPosition();
	}

	addTranslation = (translation=new Translation(0, 0, 0, this)) => {
		this.addTransformation(translation);
	}

	// Make the object's outline pop
	select = () => {
		this.label.element.classList.add('selected');

		let selection = new THREE.LineSegments(this.outline.geometry.clone(), new THREE.LineBasicMaterial({
			depthTest: false,
			color: this.outline.material.color,
			linewidth: SceneHelper.SELECTED_LINEWIDTH,
		}));

		// Render in front of all other objects
		selection.renderOrder = 1;
		this.selection = selection;

		this.add(selection);
	}

	// Reset to the intial state
	deselect = () => {
		this.label.element.classList.remove('selected');

		this.remove(this.selection);
		this.selection.material.dispose();
		this.selection.geometry.dispose();

		delete this.selection;
	}

	// Update the 'filling' color
	updateColor = (color) => {
		this.material.color.setHex(color);
		this.updateScene(true, [{
			uuid: this.uuid,
			valueName: 'color',
			value: color
		}]);
	}

	updateOutlineColor = (outlineColor) => {
		this.outline.material.color.setHex(outlineColor);

		// Update the selection as well
		this.deselect();
		this.select();

		this.updateScene(true, [{
			uuid: this.uuid,
			valueName: 'outlineColor',
			value: outlineColor
		}]);
	}

	// Update the intial position (before transformation)
	updatePosition = (position) => {
		let { x, y, z } = position;

		let translationMatrix = new THREE.Matrix4().makeTranslation(x, y, z);

		this.originalMatrix = translationMatrix;
		this.originalPosition = position;
		this.matrix.copy(translationMatrix);

		this.applyTransformations(1);
		this.updateScene(false, [{
			uuid: this.uuid,
			valueName: 'originalPosition',
			value: this.originalPosition
		},{
			uuid: this.uuid,
			valueName: 'originalMatrix',
			value: this.originalMatrix
		}]);
	}

	updateGeometry = (geometry) => {
		this.geometry.dispose();
		this.outline.geometry.dispose();

		this.geometry = geometry;
		this.outline.geometry = new THREE.EdgesGeometry(geometry);

		this.deselect();
		this.select();
		this.applyTransformations(1);
		this.updateScene(false, [{
			uuid: this.uuid,
			valueName: 'geometry',
			value: this.geometry.toJSON()
		}]);
	}

	clean = () => {
		this.notifyRegistreeOfDeletion();
		this.remove(this.label);

		this.geometry.dispose();
		this.material.dispose();
		this.outline.geometry.dispose();
		this.outline.material.dispose();
	}

	getCenter = () => this.position;

	getCoordinatesEditor = () => (
		<CoordinatesPicker name="Position" coordinates={this.originalPosition} updateCoordinates={this.updatePosition}/>
	);
}
