import React from 'react';

class LocalFetch extends React.Component {
  componentWillMount() {
    this.setState({ ready: false });
  }

  componentDidMount() {
    this.props.fetch()
      .then(this.setState({ ready: true }))
  }

  render() {
    return this.state.ready
      ? <div>{this.props.children}</div>
      : <div>Loading</div>
  }
}

export default LocalFetch;