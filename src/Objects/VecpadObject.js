import LabelFactory from './LabelFactory';

export default class VecpadObject {
    constructor(mesh) {
        this.mesh = mesh;
        this.labelSprite = null;
    }

    createLabel(label, vertices) {
        let average = array => array.reduce((sum, elem) => sum + elem, 0) / array.length;
        let highestY = Math.max(...vertices.map((vertex) => vertex.y)) + 0.25;
        let averageX = average(vertices.map((vertex) => vertex.x));
        let averageZ = average(vertices.map((vertex) => vertex.z));
        let labelFactory = new LabelFactory();
        this.labelSprite = labelFactory.createLabelSprite(label);
        this.labelSprite.position.set(averageX, highestY, averageZ);
    }
}