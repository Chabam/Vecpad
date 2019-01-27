import React, { Component } from 'react';
import Visualizer from './Visualizer';
import Sidebar from './Sidebar';
import THREEWrapper from '../THREE/THREEWrapper';

class Vecpad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      THREEWrapper: new THREEWrapper()
    };
  }

  render() {
    const { THREEWrapper } = this.state;
    return (
      <div id="vecpad-container">
        <Visualizer THREEWrapper={THREEWrapper}></Visualizer>
        <Sidebar></Sidebar>
      </div>
    );
  }
}

export default Vecpad;
