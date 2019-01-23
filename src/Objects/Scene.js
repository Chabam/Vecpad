import { GLW } from '../WebGL/GLWrapper';
import { WHITE } from './Color';
import { mat4 } from 'gl-matrix'

class Scene {
    constructor() {
        this.objects = [];
        this.positionBuffer = null;
        this.colorBuffer = null;
        this.vertexCount = 0;
    }

    addObject(object) {
        this.objects.push(object);
    }

    removeObject(object) {
        this.objects = this.objects.filter((elem) => elem.id =! object.id);
    }

    serializeScene() {
        return this.objects.reduce((buffers, object) => {
            this.vertexCount += object.vertices.length;
            const { vertices, colors } = object.asArrays();
            return {
                colors: buffers.colors.concat(colors),
                positions: buffers.vertices.concat(vertices)
            }
        }, {
            vertices: [],
            colors: []
        });
    }

    init() {
        const { positions, colors } = this.serializeScene();
        this.positionBuffer = GLW.createBuffer();
        GLW.bindArrayBuffer(this.positionBuffer);
        GLW.bindDataToBuffer(positions);
        this.colorBuffer = GLW.createBuffer();
        GLW.bindArrayBuffer(this.colorBuffer);
        GLW.bindDataToBuffer(colors);
        GLW.setClearColor(WHITE);
    }

    draw() {
        GLW.clear();
        let programInfo = GLW.getContext();

        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = GLW.gl.canvas.clientWidth / GLW.gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();

        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.perspective(projectionMatrix,
                         fieldOfView,
                         aspect,
                         zNear,
                         zFar);

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelViewMatrix = mat4.create();

        // Now move the drawing position a bit to where we want to
        // start drawing the square.

        mat4.translate(modelViewMatrix,     // destination matrix
                       modelViewMatrix,     // matrix to translate
                       [-1.0, 0.0, -6.0]);  // amount to translate

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
          const numComponents = 3;  // pull out 2 values per iteration
          const type = GLW.gl.FLOAT;    // the data in the buffer is 32bit floats
          const normalize = false;  // don't normalize
          const stride = 0;         // how many bytes to get from one set of values to the next
                                    // 0 = use type and numComponents above
          const offset = 0;         // how many bytes inside the buffer to start from
          GLW.bindArrayBuffer(this.positionBuffer);
          GLW.gl.vertexAttribPointer(
              programInfo.attribLocations.vertexPosition,
              numComponents,
              type,
              normalize,
              stride,
              offset);
            GLW.gl.enableVertexAttribArray(
              programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL to use our program when drawing

        GLW.gl.useProgram(programInfo.program);

        // Set the shader uniforms

        GLW.gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
            GLW.gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        {
          const offset = 0;
          GLW.gl.drawArrays(GLW.gl.LINES, offset, this.vertexCount);
        }

    }

}

export { Scene };