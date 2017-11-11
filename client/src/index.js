import '../../node_modules/font-awesome/scss/font-awesome.scss';
import './sass/style.scss';

import React from 'react'; 
import ReactDOM from 'react-dom';
import App from './components/App';

import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
const initialState = window.__INITIAL_STATE__;
const store = createStore(reducer, initialState, applyMiddleware(thunkMiddleware));

import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';
const socket = io.connect();

import { addActivityItem, replaceRoster } from './actions';
socket.on('activity:create', item => {
  store.dispatch(addActivityItem(item));
});
socket.on('roster:create', roster => {
  store.dispatch(replaceRoster(roster));
});
socket.on('message', msg => console.log(msg));

console.log(store.getState());

ReactDOM.render(
  <Provider store={store}>
    <SocketProvider socket={socket}>
      <App />
    </SocketProvider>
  </Provider>,
  document.getElementById('app')
);