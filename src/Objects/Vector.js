import { VecpadObject } from "./VecpadObject";
import { BLACK } from "./Color";

class Vector extends VecpadObject {
    constructor(name, p1, p2, color=BLACK) {
        super(name, [p1, p2], color);
    }
}

export { Vector }