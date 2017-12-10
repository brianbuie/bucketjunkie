import React from 'react';
import { get } from 'actions';

class FetchContainer extends React.Component {
  componentWillMount(){
    this.setState({ ready: false });
  }

  componentDidMount(){
    get(this.props.url)
      .then(res => this.setState({
        ready: true,
        res
      }));
  }

  render() {
    let Component = this.props.component;
    if (this.state.ready) return <Component {...this.props} {...this.state.res.json} />
    return <div>Loading</div>
  }
}

export default FetchContainer;