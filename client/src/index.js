import '../../node_modules/font-awesome/scss/font-awesome.scss';
import './sass/style.scss';

import React from 'react'; 
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import App from './components/App';
import reducers from './reducers.js';

const initialState = window.__INITIAL_STATE__;
const store = createStore(reducers, initialState, applyMiddleware(thunkMiddleware));
console.log(store.getState());

const mount = document.getElementById('app');

if (mount) {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    mount
  );
}