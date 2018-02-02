import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Account from 'components/Pages/Account';
import AllPlayers from 'components/Pages/AllPlayers';
import CreateLeague from 'components/Pages/CreateLeague';
import Feed from 'components/Feed/Feed';
import FetchManager from 'components/Fetch/FetchManager';
import Head from 'components/Head/Head';
import LeaguePage from 'components/Pages/LeaguePage';
import LeagueStandings from 'components/Pages/LeagueStandings';
import NavContainer from 'components/Nav/NavContainer';
import NotificationListener from 'features/notifications/NotificationListener';
import NotFound from 'components/Pages/NotFound';
import OpenLeagues from 'components/Pages/OpenLeagues';
import PageBlockingLoader from 'features/loading/PageBlockingLoader';
import Toast from 'components/Toast/Toast';

const App = ({ league }) => (
  <div className="full-height flex-row">
    <PageBlockingLoader />
    <NotificationListener />
    <Head />
    <FetchManager />
    <Toast />
    <NavContainer />
    <Switch>
      <Route path="/account" component={Account} />
      <Route path="/teams/:team" component={AllPlayers} />
      <Route path="/teams" component={AllPlayers} />
      <Route path="/rosters" render={() => league ? <LeagueStandings /> : <Redirect to="/"/> } />
      <Route path="/leagues/public" component={OpenLeagues} />
      <Route path="/leagues/create" component={CreateLeague} />
      <Route path="/league/:id" component={LeaguePage} />
      <Route exact path="/" component={OpenLeagues} />
      <Route component={NotFound} />
    </Switch>
    <Feed />
  </div>
);

export default withRouter(connect(
  ({ league }) => ({ league })
)(App));