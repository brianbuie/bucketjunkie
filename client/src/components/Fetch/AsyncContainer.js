import React from 'react';

class AsyncContainer extends React.Component {

  componentWillMount() {
    this.setState({ status: 'loading' });
  }

  componentDidMount() {
    this.mounted = true;
    this.props.asyncAction()
      .then(res => {
        if (res.meta.ok) {
          if (this.props.onSuccess) this.props.onSuccess(res.json);
          if (this.mounted) this.setState({ status: 'ok', res });
        } else {
          if (this.props.onError) this.props.onError(res.json);
          if (this.mounted) this.setState({ status: 'error', res });
        }
      })
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    let { Component, ErrorComponent, LoadingComponent, ...props } = this.props;
    if (this.state.status === 'loading') return LoadingComponent
      ? <LoadingComponent />
      : 'Loading';
    if (this.state.status === 'error') return ErrorComponent
      ? <ErrorComponent {...this.state} /> 
      : 'Error';
    return <Component {...props} {...this.state.res.json} />
  }
}

export default AsyncContainer;