import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import MedList from './components/med-list';
// import {Provider} from 'react-redux';
// import store from './store';

console.log(`Client running in ${process.env.NODE_ENV} mode`);

let items = ["Toast", "Bread", "Eggs"];

document.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(<MedList meds={items}/>,document.getElementById('app')
	);
});