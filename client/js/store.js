import redux from 'redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducer/medication';

let store = createStore(reducers.gameReducer, applyMiddleware(thunk));

module.exports = store;