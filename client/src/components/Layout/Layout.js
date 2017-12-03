import React from 'react';
import { Col, Row } from 'reactstrap';
import { Route } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { NoScrollbars } from 'components/Utilities';
import Feed from 'components/Feed/Feed';
import IconMenu from 'components/IconMenu/IconMenu';
import AllPlayers from 'components/Player/AllPlayers';
import PlayerDetail from 'components/Player/PlayerDetail';
import LeagueStandings from 'components/League/LeagueStandings';

const Layout = ({ }) => (
  <div className="full-height d-flex flex-row">
    <div className="height-100 text-center" style={{ width: "35px" }}>
      <NoScrollbars>
        <IconMenu />
      </NoScrollbars>
    </div>
    <Row noGutters className="flex-grow height-100">
      <Col xs="6" className="height-100">
        <Scrollbars autoHide>
          <Route path="/teams/:team" component={AllPlayers} />
          <Route path="/rosters" component={LeagueStandings} />
        </Scrollbars>
      </Col>
      <Col xs="6">
        <Route path="/players/:id" component={PlayerDetail} />
      </Col>
    </Row>
    <Feed />
  </div>
);

export default Layout;