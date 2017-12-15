import './PageHeading.scss';

import React from 'react';
import { Row, Col } from 'reactstrap';

const PageHeading = ({ eyebrow, headline, children }) => (
  <Row className="PageHeading" noGutters>
    <Col className="flex-column justify-content-end px-2">
      <span className="faded-2">{eyebrow}</span>
      <h2>{headline}</h2>
    </Col>
    <Col xs="2">
      {children}
    </Col>
  </Row>
);

export default PageHeading;