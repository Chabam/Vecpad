import React, { Component } from 'react';
import { Toolbar } from './Toolbar';
import { GLW } from '../WebGL/GLWrapper';

const id = 'visualizer';

class Visualizer extends Component {
    constructor(props) {
        super(props);
        this.scene = props.scene;
    }

    componentDidMount() {
        const canvas = document.querySelector(`#${id}`);

        if (!canvas) {
            console.error('Could not find the canvas element, aborting!');
            return;
        }

        const gl = canvas.getContext('webgl');

        if (!gl) {
            console.error('Unable to initialize WebGL. Your browser or machine may not support it.');
            return;
        }

        GLW.initContext(gl);
        this.scene.init();
        this.scene.draw();
    }

    render() {
        return (
            <div id="visualizer-container">
                <Toolbar></Toolbar>
                <canvas id={id} height={this.props.height} width={this.props.width}>
                    Your browser does not support WebGl
                </canvas>
            </div>
        );
    }
}

export { Visualizer };