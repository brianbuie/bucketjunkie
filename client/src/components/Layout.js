import React, { Component } from 'react';
import Activity from './Activity';

class Layout extends Component {
  render() {
    return (
      <div className="row no-gutters height-100">
        <div className="col px-3 scroll-y">
          { this.props.children }
        </div>
        <div className="col max-height-100 d-flex flex-column justify-content-end activity__container">
          <Activity />
        </div>
      </div>
    );
  }
}

export default Layout;