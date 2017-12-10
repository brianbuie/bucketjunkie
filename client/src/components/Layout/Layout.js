import React from 'react';
import { Col, Row } from 'reactstrap';
import { Route } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { NoScrollbars } from 'components/Utilities';
import Feed from 'components/Feed/Feed';
import IconMenu from 'components/IconMenu/IconMenu';
import AllPlayers from 'components/Player/AllPlayers';
import DetailView from 'components/Layout/DetailView';
import LeagueStandings from 'components/League/LeagueStandings';
import OpenLeagues from 'components/League/OpenLeagues';

const Layout = ({ }) => (
  <div className="full-height d-flex flex-row">
    <div className="height-100 text-center" style={{ width: "35px" }}>
      <NoScrollbars>
        <IconMenu />
      </NoScrollbars>
    </div>
    <Row noGutters className="width-100 height-100">
      <Col xs="5" className="height-100">
        <Scrollbars autoHide>
          <Route exact path="/teams" component={AllPlayers} />
          <Route path="/teams/:team" component={AllPlayers} />
          <Route path="/rosters" component={LeagueStandings} />
          <Route path="/leagues/public" component={OpenLeagues} />
        </Scrollbars>
      </Col>
      <Col xs="7">
        <DetailView />
      </Col>
    </Row>
    <Feed />
  </div>
);

export default Layout;