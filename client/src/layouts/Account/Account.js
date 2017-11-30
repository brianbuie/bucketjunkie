import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Route } from 'react-router-dom';
import RouteUserRequired from 'components/Auth/RouteUserRequired';
import routes from 'routes';

import AccountPage from 'pages/AccountPage/AccountPage';
import LoginPage from 'pages/LoginPage/LoginPage';

const Account = ({ }) => (
  <Container className="my-5">
    <Row className="px-3">
      <Col sm="6" xl="4" className="mx-auto p-3 bg-light">
        <RouteUserRequired exact path={routes.account} component={AccountPage} />
        <Route path={routes.login} component={LoginPage} />
      </Col>
    </Row>
  </Container>
);

export default Account;