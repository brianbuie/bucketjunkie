import React from 'react';
import { Collapse as BootstrapCollapse } from 'reactstrap';

class Collapse extends React.Component {

  componentWillMount = () => {
    this.setState({ isOpen: this.props.isOpen !== undefined ? this.props.isOpen : false });
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render = () => (
    <div className={this.props.className || ''}>
      <this.props.toggler onClick={this.toggle} isOpen={this.state.isOpen} />
      <BootstrapCollapse isOpen={this.state.isOpen}>
        {this.props.children}
      </BootstrapCollapse>
    </div>
  );
}

export default Collapse;