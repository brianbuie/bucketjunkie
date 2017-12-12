import React from 'react';
import { Col, Row } from 'reactstrap';
import { Route } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { NoScrollbars } from 'components/Utilities';
import { Panel, Container } from 'components/UI';
import Feed from 'components/Feed/Feed';
import Nav from 'components/Nav/Nav';
import AllPlayers from 'components/Player/AllPlayers';
import DetailView from 'components/Layout/DetailView';
import LeagueStandings from 'components/League/LeagueStandings';
import OpenLeagues from 'components/League/OpenLeagues';

const Layout = ({ }) => (
  <div className="full-height d-flex flex-row">
    <div className="height-100 text-center" style={{ width: "200px" }}>
      <NoScrollbars>
        <Nav />
      </NoScrollbars>
    </div>
    <Row noGutters className="width-100 height-100">
      <Col xs="5" className="height-100">
        <Scrollbars autoHide>
          <Container size="4" className="width-100 height-100">
            <Route exact path="/teams" component={AllPlayers} />
            <Route path="/teams/:team" component={AllPlayers} />
            <Route path="/rosters" component={LeagueStandings} />
            <Route path="/leagues/public" component={OpenLeagues} />
          </Container>
        </Scrollbars>
      </Col>
      <Col xs="7">
        <Scrollbars autoHide>
          <Container size="4" className="width-100 height-100">
            <Panel>
              <DetailView />
            </Panel>
          </Container>
        </Scrollbars>
      </Col>
    </Row>
    <Feed />
  </div>
);

export default Layout;