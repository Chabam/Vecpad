import * as THREE from 'three';
import SceneHelper from './THREE/SceneHelper';
import VecpadObjectMixin from './VecpadObjectMixin';
import Translation from './Transformations/Translation';

export default class VecpadMesh extends THREE.Mesh {
	constructor(geometry, type, displayMode, color, outlineColor, label, updateSceneFunc) {
		super(geometry, new THREE.MeshLambertMaterial({
			color: color,
			side: THREE.DoubleSide,
			visible: displayMode !== SceneHelper.DisplayMode.OUTLINE
		}));

		this.type = type;
		this.originalPosition = this.position.clone();

		let edgesGeometry = new THREE.EdgesGeometry(geometry);
		this.outline = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({
			color: outlineColor,
			visible: displayMode !== SceneHelper.DisplayMode.FILL
		}));
		this.add(this.outline);

		VecpadObjectMixin.call(this, label, updateSceneFunc);
	}

	applyTransformations = (step) => {
		this.currentStep = step;

		let stepPerTrans = 1 / (this.transformations.length);
		let currentTrans = Math.floor(step / stepPerTrans);
		let stepInCurrentTrans = (step * this.transformations.length) - currentTrans;

		this.transformations.forEach((trans, i) => {
			if (i < currentTrans) {
				trans.step = 1;
			} else if (i > currentTrans) {
				trans.step = 0;
			} else {
				trans.step = stepInCurrentTrans;
			}
		});

		let transMatrix = this.transformations.reduce((matrix, trans) =>
			trans.getMatrix().multiply(matrix),
			new THREE.Matrix4()
		);

		this.matrix.copy(this.originalMatrix);
		this.applyMatrix(transMatrix);
		this.computeLabelPosition();
		this.callbacks.forEach(({func}) => {
			func(this, false);
		})

		this.updateScene();
	}

	addTranslation = (translation=new Translation(0, 0, 0)) => {
		this.addTransformation(translation);
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
		this.updateScene(true, [{
			uuid: this.uuid,
			valueName: 'color',
			value: color
		}]);
	}

	updateOutlineColor = (outlineColor) => {
		this.outline.material.color.setHex(outlineColor);
		this.deselect();
		this.select();
		this.updateScene(true, [{
			uuid: this.uuid,
			valueName: 'outlineColor',
			value: outlineColor
		}]);
	}

	updatePosition = (position) => {
		let { x, y, z } = position;

		let translationMatrix = new THREE.Matrix4().makeTranslation(x, y, z);
		this.matrix = new THREE.Matrix4().makeTranslation(x, y, z);
		this.originalMatrix = translationMatrix;
		this.originalPosition = position;
		this.applyMatrix(translationMatrix);

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
		this.notifyRegistree();
		this.remove(this.label);
		this.geometry.dispose();
		this.material.dispose();
		this.outline.geometry.dispose();
		this.outline.material.dispose();
	}

	toJSON = () => {
		return {
			uuid: this.uuid,
			name: this.name,
			geometry: this.geometry.toJSON(),
			type: this.type,
			color: this.material.color.getHex(),
			outlineColor: this.outline.material.color.getHex(),
			originalPosition: this.originalPosition,
			originalMatrix: this.originalMatrix,
			transformations: this.transformations.reduce(
				(trans, currentTrans) => {
					trans.push(currentTrans.toJSON());
					return trans;
				},
				[]
			)
		}
	}
}
