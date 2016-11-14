import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import MedContainer from './components/med-container';
// import {Provider} from 'react-redux';
// import store from './store';

console.log(`Client running in ${process.env.NODE_ENV} mode`);

let items = ["Toast", "Bread", "Eggs"];

document.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(<MedContainer meds={items}/>,document.getElementById('app')
	);
});