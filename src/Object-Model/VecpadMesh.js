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
        this.color = color;
        this.outlineColor = outlineColor;
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

        let { outline } = this;
        this.originalColor = outline.material.color.getHex();
        outline.material.color.setHex(SceneHelper.SELECTED_COLOR);
        outline.material.linewidth = SceneHelper.SELECTED_LINEWIDTH;

        outline.renderOrder = 1;
        outline.material.depthTest = false;
    }

    deselect = () => {
        this.label.element.classList.remove('selected');

        let { outline, originalColor } = this;
        outline.material.color.setHex(originalColor);
        outline.material.linewidth = SceneHelper.UNSELECTED_LINEWIDTH;
        delete this.originalColor;

        outline.renderOrder = 0;
        outline.material.depthTest = true;
    }

    updateColor = (color) => {
        this.color = color;
        this.material.color.setHex(color);
        this.updateReact();
    }

    updateOutlineColor = (outlineColor) => {
        this.outlineColor = outlineColor;
        this.outline.material.color.setHex(outlineColor);
        this.updateReact();
    }

    updatePosition = (position) => {
        let { x, y, z } = position;

        let translationMatrix = new THREE.Matrix4().makeTranslation(x, y, z);
        this.matrix = new THREE.Matrix4();
        this.originalMatrix = translationMatrix;
        this.originalPosition = position;
        this.applyMatrix(translationMatrix);
        this.callbacks.forEach(({func}) => func({
            changedObject: this,
            deleted: true
        }));
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
