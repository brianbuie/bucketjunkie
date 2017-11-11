import React from 'react';
import ContentMenu from './ContentMenu';
import RostersContainer from '../Rosters/RostersContainer';
import LeagueInfoContainer from '../LeagueInfo/LeagueInfoContainer';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

const Content = ({ league, user }) => (
  <Router>
    <div className="mx-auto content__container">
      <ContentMenu leagueName={league.name} />
      <Route exact path="/dash/" component={RostersContainer} />
      <Route path="/dash/players" component={RostersContainer} />
      <Route path="/dash/info" component={LeagueInfoContainer} />
      <Route path="/dash/edit" component={RostersContainer} />
    </div>
  </Router>
);

export default Content;