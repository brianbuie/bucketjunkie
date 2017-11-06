import '../../node_modules/font-awesome/scss/font-awesome.scss';
import './sass/style.scss';

import React from 'react'; 
import ReactDOM from 'react-dom';
import App from './components/App';

const store = window.__INITIAL_STATE__;

ReactDOM.render(
  <App store={store}/>,
  document.getElementById('app')
);