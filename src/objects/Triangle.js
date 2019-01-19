import { VecpadObject } from './VecpadObject';
import { BLACK } from './Color';
import { Vector } from './Vector';

class Triangle extends VecpadObject {
    constructor(name, p1, p2, p3, color=BLACK) {
        let u = new Vector(`${name}'s u`, p1, p2, color);
        let v = new Vector(`${name}'s v`, p2, p3, color);
        let w = new Vector(`${name}'s w`, p1, p3, color);
        let vertices = VecpadObject.concatVertices(u, v, w);
        super(name, vertices, color);
    }
}

export { Triangle };