import './UI.scss';
import React from 'react';
import { Button } from 'reactstrap';

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