import React from 'react';
import { Collapse as BootstrapCollapse } from 'reactstrap';
import Toggle from 'components/Utilities/Toggle';

const Collapse = props => (
  <Toggle {...props} 
    toggleState={props.isOpen} 
    Component={({ Toggler, toggle, className, toggleState, children }) => (
      <div className={className || ''}>
        <Toggler onClick={toggle} isOpen={toggleState} />
        <BootstrapCollapse isOpen={toggleState}>
          {children}
        </BootstrapCollapse>
      </div>
    )} 
  />
);

export default Collapse;