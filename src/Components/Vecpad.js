import React, { Component } from 'react';
import Visualizer from './Visualizer';
import Sidebar from './Sidebar';
import THREEHelper from '../THREE/THREEHelper';

class Vecpad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      THREEHelper: new THREEHelper()
    };
  }

  render() {
    const { THREEHelper } = this.state;
    return (
      <div id="vecpad-container">
        <Visualizer THREEHelper={THREEHelper}></Visualizer>
        <Sidebar></Sidebar>
      </div>
    );
  }
}

export default Vecpad;
