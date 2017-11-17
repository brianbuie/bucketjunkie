import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import routes from './routes';

// Layouts
import Dashboard from './layouts/Dashboard/Dashboard';

// Pages
import DashHome from './pages/DashHome/DashHome';
import EditLeague from './pages/EditLeague/EditLeague';
import LeagueInfo from './pages/LeagueInfo/LeagueInfo';
import AllPlayers from './pages/Players/AllPlayers';

// Components
import Loading from './components/Loading/Loading';
import Menu from './components/Menu/Menu';
import Toast from './components/Toast/Toast';

const App = () => (
  <Router>
    <div className="full-height d-flex flex-column">
      <Loading />
      <Menu />
      <Toast />
      <Dashboard>
        <Route exact path={routes.rosters} component={DashHome} />
        <Route path={routes.players} component={AllPlayers} />
        <Route path={routes.leagueInfo} component={LeagueInfo} />
        <Route path={routes.leagueEdit} component={EditLeague} />
      </Dashboard>
    </div>
  </Router>
);

export default App;