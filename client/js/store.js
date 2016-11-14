import redux from 'redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers/medication';

let store = createStore(reducers.gameReducer, applyMiddleware(thunk));

module.exports = store;