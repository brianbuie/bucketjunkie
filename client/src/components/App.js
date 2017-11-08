import React from 'react';
import ActivityContainer from './Activity/ActivityContainer';

const App = () => (
  <div className="full-height d-flex flex-column">
    <div className="row no-gutters height-100">
      <div className="col px-3 scroll-y">
      </div>
      <div className="col height-100 d-flex flex-column justify-content-end activity__container">
        <ActivityContainer />
      </div>
    </div>
  </div>
);

export default App;