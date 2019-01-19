class Vertex {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    asArray() {
        return [this.x, this.y, this.z];
    }
}

export { Vertex };