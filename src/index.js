import React from 'react';
import ReactDOM from 'react-dom';
import Vecpad from './Components/Vecpad';
import './Sass/Vecpad.scss';

/*
	This is the main entry point of Vecpad, the next line instanciate the main React component of
	the application. It will attach it to the element #root (see in ~/public/index.html).
*/
ReactDOM.render(<Vecpad />, document.getElementById('root'));
