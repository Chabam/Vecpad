// The default color representation is the classic OpenGl :
// r, g, b, a => a value between 0 and 1
class Color {
    constructor(r, g, b, a=1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    asArray() {
        return [this.r, this.g, this.b, this.a];
    }

    static fromRBGA(r, g, b, a) {
        return new Color(r / 255, g / 255, b / 255, a);
    }
}

const BLACK = new Color(0, 0, 0);
const WHITE = new Color(1, 1, 1);
const RED   = new Color(1, 0, 0);
const GREEN = new Color(0, 1, 0);
const BLUE  = new Color(0, 0, 1);

export { Color, BLACK, WHITE, RED, GREEN, BLUE };