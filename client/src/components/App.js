import React from 'react';
import ActivityContainer from './Activity/ActivityContainer';
import ContentContainer from './Content/ContentContainer';
import Menu from './Menu/Menu';

const App = () => (
  <div className="full-height d-flex flex-column">
    <Menu />
    <div className="row no-gutters height-100">
      <div className="col px-3 scroll-y">
        <ContentContainer />
      </div>
      <div className="col height-100 d-flex flex-column justify-content-end activity__container">
        <ActivityContainer />
      </div>
    </div>
  </div>
);

export default App;