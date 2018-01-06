import React from 'react';
import { Route } from 'react-router-dom';
import FetchManager from 'components/FetchManager/FetchManager';
import Loading from 'components/Loading/Loading';
import Toast from 'components/Toast/Toast';
import Feed from 'components/Feed/Feed';
import Nav from 'components/Nav/Nav';
import AllPlayers from 'components/Pages/AllPlayers';
import LeagueStandings from 'components/Pages/LeagueStandings';
import OpenLeagues from 'components/Pages/OpenLeagues';
import LeaguePage from 'components/Pages/LeaguePage';
import CreateLeague from 'components/Pages/CreateLeague'; 

const App = () => (
  <div className="full-height flex-row">
    <FetchManager />
    <Loading />
    <Toast />
    <Nav />
    <Route exact path="/teams" component={AllPlayers} />
    <Route path="/teams/:team" component={AllPlayers} />
    <Route path="/rosters" component={LeagueStandings} />
    <Route path="/leagues/public" component={OpenLeagues} />
    <Route path="/leagues/create" component={CreateLeague} />
    <Route path="/league/:id" component={LeaguePage} />
    <Feed />
  </div>
);

export default App;