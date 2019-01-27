import React, { Component } from 'react';
import Toolbar from './Toolbar';

export default class Visualizer extends Component {
    constructor(props) {
        super(props);
        this.THREEWrapper = props.THREEWrapper;
    }

    componentDidMount() {
        this.THREEWrapper.init();
    }

    render() {
        return (
            <div id="visualizer-container">
                <Toolbar></Toolbar>
                <div id="visualizer"></div>
            </div>
        );
    }
}

export { Visualizer };