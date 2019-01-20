import { fsSource, vsSource } from './Shaders';

class GLWrapper {

    // Initializing functions

    init(gl) {
        this.gl = gl;
        this.shaderProgram = this.initProgram();
        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
                vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            },
        };
    }

    initProgram() {
        const vertexShader = this.compileShader(vsSource, this.gl.VERTEX_SHADER);
        const fragmentShader = this.compileShader(fsSource, this.gl.FRAGMENT_SHADER);

        const shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);

        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            console.log(`Unable to initialize the shader program: ${this.gl.getProgramInfoLog(shaderProgram)}`);
            return null;
        }

        return shaderProgram;
    }

    compileShader(shaderSource, shaderType) {
        const shader = this.gl.createShader(shaderType);
        this.gl.shaderSource(shader, shaderSource);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(`The compiling of a shader failed : ${this.gl.getShaderInfoLog(shader)}`);
        }
        return shader;
    }

    // Utility functions

    clear(color) {
        this.gl.clearColor(color.r, color.g, color.b, color.a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
}

const GLW = new GLWrapper();

export { GLW };