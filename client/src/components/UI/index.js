import './UI.scss';
import React from 'react';

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

export const Panel = ({ children, className }) => (
  <div className={"Panel " + (className || '')}>
    {children}
  </div>
);