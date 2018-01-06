import React from 'react';
import { get } from 'actions';

class FetchContainer extends React.Component {

  componentWillMount = () => {
    this.setState({ status: 'loading' });
  }

  fetch = url => {
    this.setState({ status: 'loading' });
    get(url).then(res => this.setState({
      status: res.meta.ok ? 'ok' : 'error',
      res
    }));
  }

  componentDidMount = () => { 
    this.fetch(this.props.url); 
  }

  componentWillReceiveProps = newProps => {
    if (newProps.url != this.props.url) this.fetch(newProps.url);
  }

  render = () => {
    let Component = this.props.component;
    if (this.state.status === 'ok') return <Component {...this.props} {...this.state.res.json} />
    if (this.state.status === 'error') return 'Error';
    return <div>Loading</div>
  }
}

export default FetchContainer;