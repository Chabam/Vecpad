import React, { Component } from 'react';
import { Toolbar } from './Toolbar';

class Visualizer extends Component {
    render() {
        return (
            <div id="visualizer-container">
                <Toolbar></Toolbar>
                <canvas id="visualizer" height={this.props.height} width={this.props.width}>
                    Your browser does not support WebGl
                </canvas>
            </div>
        );
    }
}

export { Visualizer };