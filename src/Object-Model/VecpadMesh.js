import * as THREE from 'three';
import SceneHelper from './THREE/SceneHelper';
import VecpadObjectMixin from './VecpadObjectMixin';
import Translation from './Transformations/Translation';

export default class VecpadMesh extends THREE.Mesh {
	constructor(geometry, type, displayMode, color, outlineColor, label, reactUpdateFunc) {
		super(geometry, new THREE.MeshLambertMaterial({
			color: color,
			side: THREE.DoubleSide,
			visible: displayMode !== SceneHelper.DisplayMode.OUTLINE
		}));

		this.type = type;
		this.originalPosition = this.position;

		let edgesGeometry = new THREE.EdgesGeometry(geometry);
		this.outline = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({
			color: outlineColor,
			visible: displayMode !== SceneHelper.DisplayMode.FILL
		}));
		this.add(this.outline);

		VecpadObjectMixin.call(this, label, reactUpdateFunc);
	}

	applyTransformations = (step) => {
		this.currentStep = step;

		let stepPerTrans = 1 / (this.transformations.length);
		let currentTrans = Math.floor(step / stepPerTrans);
		let stepInCurrentTrans = (step * this.transformations.length) - currentTrans;

		this.matrix.copy(this.originalMatrix);

		let transMatrix = this.transformations.slice(0, currentTrans).reduce((matrix, trans) =>
			trans.getMatrix(1).multiply(matrix),
			new THREE.Matrix4()
		);
		if (currentTrans < this.transformations.length) {
			transMatrix = this.transformations[currentTrans]
				.getMatrix(stepInCurrentTrans).multiply(transMatrix);
		}

		this.applyMatrix(transMatrix);
		this.computeLabelPosition();
		this.callbacks.forEach(({func}) => {
			func({
				changedObject: this,
				delete: false
			});
		})
		this.updateReact();
	}

	addTranslation = () => {
		this.addTransformation(new Translation(0, 0, 0));
	}

	select = () => {
		this.label.element.classList.add('selected');
		let selection = new THREE.LineSegments(this.outline.geometry.clone(), new THREE.LineBasicMaterial({
			depthTest: false,
			color: this.outline.material.color,
			linewidth: SceneHelper.SELECTED_LINEWIDTH,
		}));
		selection.renderOrder = 1;
		this.selection = selection;
		this.add(selection);
	}

	deselect = () => {
		this.label.element.classList.remove('selected');
		this.remove(this.selection);
		this.selection.material.dispose();
		this.selection.geometry.dispose();
		delete this.selection;
	}

	updateColor = (color) => {
		this.material.color.setHex(color);
		this.updateReact();
	}

	updateOutlineColor = (outlineColor) => {
		this.outline.material.color.setHex(outlineColor);
		this.deselect();
		this.select();
		this.updateReact();
	}

	updatePosition = (position) => {
		let { x, y, z } = position;

		let translationMatrix = new THREE.Matrix4().makeTranslation(x, y, z);
		this.matrix = new THREE.Matrix4().makeTranslation(x, y, z);
		this.originalMatrix = translationMatrix;
		this.originalPosition = position;
		this.applyMatrix(translationMatrix);

		this.applyTransformations(1);
		this.updateReact();
	}

	updateGeometry = (geometry) => {
		this.geometry.dispose();
		this.outline.geometry.dispose();

		this.geometry = geometry;
		this.outline.geometry = new THREE.EdgesGeometry(geometry);

		this.deselect();
		this.select();
		this.applyTransformations(1);
		this.updateReact();
	}

	clean = () => {
		this.notifyRegistree();
		this.remove(this.label);
		this.geometry.dispose();
		this.material.dispose();
		this.outline.geometry.dispose();
		this.outline.material.dispose();
	}
}
