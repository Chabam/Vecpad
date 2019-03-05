import * as THREE from 'three';
import SceneHelper from './THREE/SceneHelper';
import VecpadObjectMixin from './VecpadObjectMixin';

export default class VecpadMesh extends THREE.Mesh {
    constructor(geometry, type, displayMode, color=0xffffff, outlineColor=0x000000, label, reactUpdateFunc) {
        super(geometry, new THREE.MeshLambertMaterial({
			color: color,
			side: THREE.DoubleSide,
			opacity: 0,
			transparent: (displayMode === SceneHelper.DisplayMode.OUTLINE)
        }));
        this.type = type;
        let edgesGeometry = new THREE.EdgesGeometry(geometry);
        this.outline = new THREE.LineSegments(edgesGeometry, new THREE.LineBasicMaterial({
			color: outlineColor,
			opacity: 0,
			transparent: (displayMode === SceneHelper.DisplayMode.FILL)
        }));
        this.add(this.outline);

        VecpadObjectMixin.call(this, label, reactUpdateFunc);
    }

    select = () => {
        this.label.element.classList.add('selected');
        let selection = new THREE.LineSegments(this.outline.geometry, new THREE.LineBasicMaterial({
            depthTest: false,
            color: SceneHelper.SELECTED_COLOR,
            linewidth: SceneHelper.SELECTED_LINEWIDTH
        }));
        this.selection = selection;
        this.add(selection);
    }

    deselect = () => {
        this.label.element.classList.remove('selected');
        this.remove(this.selection);
        delete this.selection;
    }
}
