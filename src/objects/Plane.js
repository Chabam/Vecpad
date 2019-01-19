import { VecpadObject } from './VecpadObject';
import { Vector } from './Vector';
import { BLACK } from './Color';

class Plane extends VecpadObject {
    constructor(name, p1, p2, p3, p4, color=BLACK) {
        let u = new Vector(`${name}'s u`, p1, p2);
        let v = new Vector(`${name}'s v`, p2, p3);
        let w = new Vector(`${name}'s w`, p3, p4);
        let x = new Vector(`${name}'s x`, p1, p4);
        let vertices = VecpadObject.concatVertices(u, v, w, x);
        super(name, vertices, color);
    }
}

export { Plane };