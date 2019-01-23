import { fsSource, vsSource } from './Shaders';

class GLWrapper {

    // Initializing functions

    initContext(gl) {
        this.gl = gl;
        this.shaderProgram = this.createProgram();

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        this.context = {
            program: this.shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
                vertexColor: gl.getAttribLocation(this.shaderProgram, 'aVertexColor'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix'),
            },
        };
    }

    createProgram() {
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

    clear() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    setClearColor(color) {
        this.gl.clearColor(color.r, color.g, color.b, color.a);
    }

    createBuffer() {
        return this.gl.createBuffer();
    }

    bindArrayBuffer(buffer) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    }

    bindDataToBuffer(data) {
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    }

    getContext() {
        return this.context;
    }
}

const GLW = new GLWrapper();

export { GLW };