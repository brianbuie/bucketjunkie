import React from 'react';

class AsyncContainer extends React.Component {

  componentWillMount = () => {
    this.setState({ 
      status: 'loading',
      data: null
    });
  }

  componentDidMount = () => {
    this.mounted = true;
    this.doAction();
  }

  componentWillUnmount = () => {
    this.mounted = false;
  }

  componentWillReceiveProps = newProps => {
    if (!newProps.refreshTrigger) return;
    if (newProps.refreshTrigger != this.props.refreshTrigger) {
      this.componentWillMount();
      this.doAction();
    }
  }

  doAction = () => {
    if (!this.mounted) return;
    this.props.asyncAction()
      .then(res => {
        let data = res ? res.json : {};
        let status = (res && res.meta && !res.meta.ok) ? 'error' : 'ok';
        if (!this.mounted) return;
        if (status === 'ok') {
          if (this.props.onSuccess) this.props.onSuccess(data);
          this.setState({ status, data });
        } else {
          if (this.props.onError) this.props.onError(data);
          this.setState({ status, data });
        }
      })
  }

  render = () => {
    let { Component, ErrorComponent, LoadingComponent, ...props } = this.props;
    if (this.state.status === 'loading' && LoadingComponent) return(
      <LoadingComponent {...props} />
    );
    if (this.state.status === 'error' && ErrorComponent) return(
      <ErrorComponent {...props} {...this.state.data} />
    );
    return(
      <Component {...props} {...this.state.data} />
    );
  }
}

export default AsyncContainer;