import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import MedContainer from './components/med-container';
import {Provider} from 'react-redux';
import store from './store';

console.log(`Client running in ${process.env.NODE_ENV} mode`);

document.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(
		<Provider store={store}>
			<MedContainer />
		</Provider>, document.getElementById('app')
	);
});