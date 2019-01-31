import React, { Component } from 'react';
import Toolbar from './Toolbar';
import Cube from '../Objects/Cube';

export default class Visualizer extends Component {
    constructor(props) {
        super(props);
        this.THREEHelper = props.THREEHelper;
    }

    componentDidMount() {
        this.THREEHelper.init();
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