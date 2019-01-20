import { BLACK } from "./Color";

class VecpadObject {
    constructor(name, vertices, color=BLACK) {
        this.name = name;
        this.vertices = vertices;
        this.color = color;
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

    static concatVertices() {
        return Array.from(arguments).reduce((vertices, object) => vertices.concat(object.vertices), []);
    }
}

export { VecpadObject };