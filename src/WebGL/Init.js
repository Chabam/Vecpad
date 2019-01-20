import { GLW } from './GLWrapper';

function init(canvasId) {
    const canvas = document.querySelector(`#${canvasId}`);

    if (!canvas) {
        console.error('Could not find the canvas element, aborting!');
        return;
    }

    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    GLW.init(gl);

}

export { init };