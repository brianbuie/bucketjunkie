import './PageHeading.scss';

import React from 'react';
import { Row, Col } from 'reactstrap';

const PageHeading = ({ eyebrow, headline, subhead, children }) => (
  <Row className="PageHeading" noGutters>
    <Col xs="10" className="flex-column justify-content-end px-2">
      {eyebrow ? <span className="faded-2">{eyebrow}</span> : ''}
      <h2 className="text-truncate">{headline}</h2>
      <small className="mt-2 faded-2">{subhead}</small>
    </Col>
    <Col xs="2" className="flex-column justify-content-center">
      {children}
    </Col>
  </Row>
);

export default PageHeading;