import React from 'react';
import { Route } from 'react-router-dom';
import routes from 'routes';

// Layouts
import Dashboard from 'layouts/Dashboard/Dashboard';
import Account from 'layouts/Account/Account';
import MyLeagues from 'layouts/Leagues/MyLeagues';

// Components
import RouteUserRequired from 'components/Auth/RouteUserRequired';
import Loading from 'components/Loading/Loading';
import Menu from 'components/Menu/Menu';
import Toast from 'components/Toast/Toast';

const App = () => (
  <div className="full-height d-flex flex-column">
    <Loading />
    <Menu />
    <Toast />
    <RouteUserRequired path={routes.rosters} component={Dashboard} />
    <Route path={routes.account} component={Account} />
    <RouteUserRequired path={routes.myLeagues} component={MyLeagues} />
  </div>
);

export default App;