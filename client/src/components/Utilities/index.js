import React from 'react';

export const A = ({ click, className, children, active }) => (
  <a
    href=""
    className={`${className ? className : ''} ${active ? 'active' : ''}`}
    onClick={e => {
      e.preventDefault();
      click();
    }}
  >
    {children}
  </a>
);