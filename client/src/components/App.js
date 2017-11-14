import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Loading from './Loading';
import Menu from './Menu';
import Toast from './Toast/Toast';
import Dashboard from './Dashboard';
import RostersContainer from './Rosters/RostersContainer';
import EditLeague from './EditLeague';
import LeagueInfo from './LeagueInfo';
import AllPlayers from './Player/AllPlayers';
import routes from '../routes';

const App = () => (
  <Router>
    <div className="full-height d-flex flex-column">
      <Loading />
      <Menu />
      <Toast />
      <Dashboard>
        <Route exact path={routes.rosters} component={RostersContainer} />
        <Route path={routes.players} component={AllPlayers} />
        <Route path={routes.leagueInfo} component={LeagueInfo} />
        <Route path={routes.leagueEdit} component={EditLeague} />
      </Dashboard>
    </div>
  </Router>
);

export default App;