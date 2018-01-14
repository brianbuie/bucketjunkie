import React from 'react';

class Toggle extends React.Component {
  componentWillMount = () => {
    this.setState({
      toggleState: this.props.toggleState || false
    });
  }

  toggle = () => {
    this.setState({
      toggleState: !this.state.toggleState
    });
  }

  render = () => {
    const { Component, toggleState, ...props } = this.props;
    return <Component toggle={this.toggle} toggleState={this.state.toggleState} {...props} />
  }
}

export default Toggle;