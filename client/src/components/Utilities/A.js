import React from 'react';

const A = ({ click, className, children, active, style }) => (
  <a
    href=""
    className={`${className || ''} ${active ? 'active' : ''}`}
    onClick={e => { 
      e.preventDefault(); 
      if (click) click();
    }}
    style={style || {}}
  >
    {children}
  </a>
);

export default A;