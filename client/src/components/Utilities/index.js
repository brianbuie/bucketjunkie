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

export const Container = ({ children }) => (
  <div className="py-2">
    {children}
  </div>
);

export const NoScrollbars = ({ children }) => (
  <Scrollbars renderThumbVertical={() => <i/>}>
    {children}
  </Scrollbars>
);