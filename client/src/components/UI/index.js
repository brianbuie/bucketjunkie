import './UI.scss';
import React from 'react';
import { Button, Row, Col } from 'reactstrap';

export const ImageRound = ({ path }) => (
  <div className="rounded-circle Image--Round"
    style={{backgroundImage: `url("${path}")`}}
  >
  </div>
);

export const Container = ({ children, className, size }) => (
  <div className={`p-${size || 2} ${className || ''}`}>
    {children}
  </div>
);

export const Panel = ({ children, className, close }) => (
  <div className={`Panel position-relative ${className || ''}`}>
    {close && 
      <Button className="close" onClick={close}>
        &times;
      </Button>
    }
    {children}
  </div>
);

export const PageHeading = ({ eyebrow, headline, subhead, children }) => (
  <Row className="mb-3 pb-3 border-bottom" noGutters>
    <Col xs="10" className="flex-column justify-content-end px-2">
      {eyebrow ? <span className="faded-2">{eyebrow}</span> : ''}
      <h2 className="text-truncate pb-1">{headline}</h2>
      <small className="mt-2 faded-2">{subhead}</small>
    </Col>
    <Col xs="2" className="flex-column justify-content-center">
      {children}
    </Col>
  </Row>
);