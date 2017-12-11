import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

export const A = ({ click, className, children, active }) => (
  <a
    href=""
    className={`${className || ''} ${active ? 'active' : ''}`}
    onClick={e => {
      e.preventDefault();
      click();
    }}
  >
    {children}
  </a>
);

export const NoScrollbars = ({ children }) => (
  <Scrollbars renderThumbVertical={() => <i/>}>
    {children}
  </Scrollbars>
);

export const FullHeight = ({ children }) => (
  <div className="height-100 d-flex flex-column">
    <Scrollbars autoHide>
      <div className="height-100 d-flex flex-column">
        {children}
      </div>
    </Scrollbars>
  </div>
);

export const FlexRow = ({ children }) => (
  <div className="d-flex flex-row">
    {children}
  </div>
);

export const FlexColumn = ({ children }) => (
  <div className="d-flex flex-column">
    {children}
  </div>
);