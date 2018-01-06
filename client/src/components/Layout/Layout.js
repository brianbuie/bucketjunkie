import React from 'react';
import { Col, Row } from 'reactstrap';
import { Route } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { Panel, Container } from 'components/UI';
import Feed from 'components/Feed/Feed';
import Nav from 'components/Nav/Nav';
import AllPlayers from 'components/Pages/AllPlayers';
import LeagueStandings from 'components/Pages/LeagueStandings';
import OpenLeagues from 'components/Pages/OpenLeagues';
import LeaguePage from 'components/Pages/LeaguePage';
import CreateLeague from 'components/Pages/CreateLeague'; 

const Layout = ({ }) => (
  <div className="full-height flex-row">
    <div className="height-100 text-center" style={{ width: "200px" }}>
      <Scrollbars autoHide>
        <Nav />
      </Scrollbars>
    </div>
    <Route exact path="/teams" component={AllPlayers} />
    <Route path="/teams/:team" component={AllPlayers} />
    <Route path="/rosters" component={LeagueStandings} />
    <Route path="/leagues/public" component={OpenLeagues} />
    <Route path="/leagues/create" component={CreateLeague} />
    <Route path="/league/:id" component={LeaguePage} />
    <Feed />
  </div>
);

export default Layout;