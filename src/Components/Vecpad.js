import React, { Component } from 'react';
import { Visualizer } from './Visualizer';
import { Sidebar } from './Sidebar';
import { Scene } from '../Objects/Scene';
import { Cube } from '../Objects/Cube';
import { Vertex } from '../Objects/Vertex';
import { BLACK } from '../Objects/Color';

class Vecpad extends Component {
  constructor(props) {
    super(props);
    let test = new Scene();
    let test2 = new Cube('lol', new Vertex(0,1,0), new Vertex(0,0,0), new Vertex(1,0,0), new Vertex(1,1,0), new Vertex(0,1,1), new Vertex(0,0,1), new Vertex(1,0,1), new Vertex(1,1,1), BLACK);
    test.addObject(test2);
    this.state = {
      scene: test
    };
  }

  render() {
    const { scene } = this.state;
    return (
      <div id="vecpad-container">
        <Visualizer scene={scene}></Visualizer>
        <Sidebar></Sidebar>
      </div>
    );
  }
}

export default Vecpad;
