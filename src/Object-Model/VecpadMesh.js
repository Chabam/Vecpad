import * as THREE from 'three';
import SceneHelper from './THREE/SceneHelper';
import VecpadObjectMixin from './VecpadObjectMixin';

export default class VecpadMesh extends THREE.Mesh {
    constructor(geometry, type, displayMode, color=0xffffff, outlineColor=0x000000, label, reactUpdateFunc) {
        super(geometry, new THREE.MeshLambertMaterial({
			color: color,
			side: THREE.DoubleSide,
			visible: displayMode !== SceneHelper.DisplayMode.OUTLINE
        }));

        this.type = type;
        this.color = color;
        this.outlineColor = outlineColor;
        let edgesGeometry = new THREE.EdgesGeometry(geometry);
        this.outline = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({
			color: outlineColor,
            visible: displayMode !== SceneHelper.DisplayMode.FILL
        }));
        this.add(this.outline);

        VecpadObjectMixin.call(this, label, reactUpdateFunc);
    }

    select = () => {
        this.label.element.classList.add('selected');
        let selection = new THREE.LineSegments(this.outline.geometry, new THREE.LineBasicMaterial({
            depthTest: false,
            color: SceneHelper.SELECTED_COLOR,
            linewidth: SceneHelper.SELECTED_LINEWIDTH,
        }));
        selection.renderOrder = 1;
        this.selection = selection;
        this.add(selection);
    }

    deselect = () => {
        this.label.element.classList.remove('selected');
        this.remove(this.selection);
        delete this.selection;
    }

    updateColor = (color) => {
        this.material.color.setHex(color);
        this.updateReact();
    }

    updateOutlineColor = (color) => {
        this.outline.material.color.setHex(color);
        this.updateReact();
    }

    updatePosition = (position) => {
        let { x, y, z } = position;

        let translationMatrix = new THREE.Matrix4().makeTranslation(x, y, z);
        this.matrix = new THREE.Matrix4();
        this.originalMatrix = translationMatrix;
        this.applyMatrix(translationMatrix);
        this.updateReact();
    }

    clean = () => this.remove(this.label);
}
