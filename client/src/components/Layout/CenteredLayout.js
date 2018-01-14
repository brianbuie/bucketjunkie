import React from 'react';
import { Container } from 'components/UI';
import { Scrollbars } from 'react-custom-scrollbars';

const CenteredLayout = ({ children }) => (
  <div className="flex-grow height-100 pb-3">
    <Scrollbars autoHide>
      <div className="flex-row justify-content-center">
        <div className="col-lg-8">
          <Container size="4" className="width-100">
            {children}
          </Container>
        </div>
      </div>
    </Scrollbars>
  </div>
);

export default CenteredLayout;