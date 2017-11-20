import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Route } from 'react-router-dom';
import routes from '../../routes';

import AccountPage from '../../pages/AccountPage/AccountPage';

const Account = ({ }) => (
  <Container className="my-5">
    <Row className="px-3">
      <Col sm="6" xl="4" className="mx-auto p-3 bg-light">
        <Route path={routes.account} component={AccountPage} />
      </Col>
    </Row>
  </Container>
);

export default Account;