import { BLACK } from './Color';
import { v4 } from 'uuid';

class VecpadObject {
    constructor(name, vertices, color=BLACK) {
        this.id = v4();
        this.name = name;
        this.vertices = vertices;
        this.color = color;
        this.dirty = false;
    }

    verticesAsArray() {
        return this.vertices.reduce((vertices, vertex) => vertices.concat(vertex.asArray()), []);
    }

    colorsAsArray() {
        return this.vertices.reduce((colors) => colors.concat(this.color.asArray()), []);
    }

    asArrays() {
        return {
            'colors'    : this.colorsAsArray(),
            'vertices'  : this.verticesAsArray()
        }
    }

    getVerticesCount() {
        return this.vertices.length();
    }

    static concatVertices() {
        return Array.from(arguments).reduce((vertices, object) => vertices.concat(object.vertices), []);
    }
}

export { VecpadObject };