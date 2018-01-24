import React from 'react';
import { Row, Col } from 'reactstrap';
import { Container } from 'components/UI';
import { Scrollbars } from 'react-custom-scrollbars';

const CenteredLayout = ({ children, className }) => (
  <div className={`${className || ''} flex-grow height-100 pb-3`}>
    <Scrollbars autoHide>
      <div className="flex-column justify-content-center height-100">
        <Row className="justify-content-center">
          <Col xs="12" sm="6" md="4">
            <Container size="4" className="width-100">
              {children}
            </Container>
          </Col>
        </Row>
      </div>
    </Scrollbars>
  </div>
);

export default CenteredLayout;