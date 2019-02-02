import * as THREE from 'three';

export default class LabelFactory {
    static instance;

    constructor() {
        if (this.instance) {
            return this.instance;
        }
        this.fontsize = 256;
        this.font = `${this.fontsize}px MONOSPACE`
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.context.font = this.font
        this.instance = this;
    }

    createLabelSprite(label) {
        this.canvas.width = this.context.measureText(label).width;
        this.canvas.height = this.fontsize;
        this.context.font = this.font;
        this.context.fillStyle = '#000000';
        this.context.fillText(label, 0, this.fontsize - (this.fontsize  * 0.225));
        let texture = new THREE.CanvasTexture(this.canvas);
        let spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            depthTest: false
        });
        let sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(0.0003 * this.canvas.width, 0.00035 * this.canvas.height)
        return sprite;
    }


}