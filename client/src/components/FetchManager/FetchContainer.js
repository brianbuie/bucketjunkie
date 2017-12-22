import React from 'react';
import { get } from 'actions';

class FetchContainer extends React.Component {
  componentWillMount(){
    this.setState({ status: 'loading' });
  }

  componentDidMount(){
    get(this.props.url)
      .then(res => this.setState({
        status: res.meta.ok ? 'ok' : 'error',
        res
      }));
  }

  render() {
    let Component = this.props.component;
    if (this.state.status === 'ok') return <Component {...this.props} {...this.state.res.json} />
    if (this.state.status === 'error') return 'Error';
    return <div>Loading</div>
  }
}

export default FetchContainer;