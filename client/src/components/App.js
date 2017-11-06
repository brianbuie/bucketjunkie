import React, { Component } from 'react';
import Menu from './Menu/Menu';
import ActivityFeed from './Activity/ActivityFeed';
import ContentContainer from './ContentContainer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: this.props.user ? true : false,
      activity: []
    };
  }

  componentWillMount() {
    fetch('/api/activity', {
      method: "GET",
      headers: { 'Accept': 'application/json' },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(activity => this.setState({ activity }))
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div className="full-height d-flex flex-column">
        <Menu isLoggedIn={this.state.isLoggedIn}/>
        <div className="row no-gutters height-100">
          <div className="col px-3 scroll-y">

          </div>
          <div className="col height-100 d-flex flex-column justify-content-end activity__container">
            <ActivityFeed activity={this.state.activity} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;