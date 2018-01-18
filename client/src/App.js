import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FetchManager from 'components/FetchManager/FetchManager';
import Loading from 'components/Loading/Loading';
import Toast from 'components/Toast/Toast';
import Feed from 'components/Feed/Feed';
import NavWrapper from 'components/Nav/NavWrapper';
import AllPlayers from 'components/Pages/AllPlayers';
import LeagueStandings from 'components/Pages/LeagueStandings';
import OpenLeagues from 'components/Pages/OpenLeagues';
import LeaguePage from 'components/Pages/LeaguePage';
import CreateLeague from 'components/Pages/CreateLeague';
import NotFound from 'components/Pages/NotFound';

const App = ({ league }) => (
  <div className="full-height flex-row">
    <FetchManager />
    <Loading />
    <Toast />
    <NavWrapper />
    <Switch>
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