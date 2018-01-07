import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

export const A = ({ click, className, children, active }) => (
  <a
    href=""
    className={`${className || ''} ${active ? 'active' : ''}`}
    onClick={e => { 
      e.preventDefault(); 
      if (click) click();
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
  <div className="height-100 flex-column">
    <Scrollbars autoHide>
      <div className="height-100 flex-column">
        {children}
      </div>
    </Scrollbars>
  </div>
);