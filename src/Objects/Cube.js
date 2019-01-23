import { VecpadObject } from './VecpadObject';
import { BLACK } from './Color';
import { Plane } from './Plane';

class Cube extends VecpadObject {
    constructor(name, p1, p2, p3, p4, p5, p6, p7, p8, color=BLACK) {
        let frontPlane   = new Plane(`${name}'s front plane`, p2, p6, p7, p3);
        let backPlane    = new Plane(`${name}'s back plane`, p1, p5, p6, p2);
        let leftPlane    = new Plane(`${name}'s left plane`, p1, p5, p6, p2);
        let rightPlane   = new Plane(`${name}'s right plane`, p3, p7, p8, p4);
        let topPlane     = new Plane(`${name}'s top plane`, p1, p2, p3, p4);
        let bottomPlane  = new Plane(`${name}'s bottom plane`, p8, p7, p6, p5);
        let vertices = VecpadObject.concatVertices(frontPlane, backPlane, leftPlane, rightPlane, topPlane, bottomPlane);
        super(name, vertices, color)
    }
}

export { Cube };