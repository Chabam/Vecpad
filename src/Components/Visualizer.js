import React, { Component } from 'react';
import { Toolbar } from './Toolbar';
import { init } from '../WebGL/Init';

const id = 'visualizer';

class Visualizer extends Component {

    componentDidMount() {
        init(id);
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