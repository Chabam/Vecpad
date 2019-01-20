import React, { Component } from 'react';
import { Visualizer } from './Visualizer';
import { Sidebar } from './Sidebar';

class Vecpad extends Component {
  render() {
    return (
      <div id="vecpad-container">
        <Visualizer></Visualizer>
        <Sidebar></Sidebar>
      </div>
    );
  }
}

export default Vecpad;
