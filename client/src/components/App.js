import React from 'react';
import Activity from './Activity';
import Content from './Content';
import Loading from './Loading';
import Menu from './Menu';
import Toast from './Toast/Toast';

const App = () => (
  <div className="full-height d-flex flex-column">
    <Loading />
    <Menu />
    <Toast />
    <div className="row no-gutters height-100">
      <div className="col px-3 scroll-y">
        <Content />
      </div>
      <div className="col height-100 d-flex flex-column justify-content-end activity__container">
        <Activity />
      </div>
    </div>
  </div>
);

export default App;