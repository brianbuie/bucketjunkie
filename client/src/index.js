import '../../node_modules/font-awesome/scss/font-awesome.scss';
import './sass/style.scss';

import React from 'react'; 
import ReactDOM from 'react-dom';
import App from './components/App';

import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';

import subscribeToLeague from './components/Socket';

const initialState = window.__INITIAL_STATE__;
const store = createStore(reducer, initialState, applyMiddleware(thunkMiddleware));

if (initialState.league._id){
  subscribeToLeague(initialState.league._id);
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);