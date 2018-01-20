import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

export const FullHeight = ({ children }) => (
  <div className="height-100 flex-column">
    <Scrollbars autoHide>
      <div className="height-100 flex-column">
        {children}
      </div>
    </Scrollbars>
  </div>
);

export default FullHeight;