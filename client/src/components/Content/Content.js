import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ContentMenu from './ContentMenu';
import RostersContainer from '../Rosters/RostersContainer';
import LeagueInfo from '../LeagueInfo';
import AllPlayers from '../Player/AllPlayers';
import routes from '../../routes';
import './Content.scss';

const Content = ({ league, user }) => (
  <Router>
    <div className="mx-auto Content__Container">
      <ContentMenu leagueName={league.name} />
      <Route exact path={routes.rosters} component={RostersContainer} />
      <Route path={routes.players} component={AllPlayers} />
      <Route path={routes.leagueInfo} component={LeagueInfo} />
      <Route path={routes.leagueEdit} component={RostersContainer} />
    </div>
  </Router>
);

export default Content;