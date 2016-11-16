/**
 * @summary index.js is the main file that will render a Board to the virtual DOM.
 *
 * @require react, react-dom, react-redux, ./store, ./components/med-container
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from './store';
import Container from './components/container';

console.log(`Client running in ${process.env.NODE_ENV} mode`);

document.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(
		<Provider store={store}>
			<Container />
		</Provider>, document.getElementById('app')
	);
});