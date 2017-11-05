const io = require('socket.io-client');
import React, { Component } from 'react';
import { Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import ActivityFeed from './ActivityFeed';

class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      collapseOpen: true,
      activityFilter: null,
      showChatInput: true,
      chatInput: '',
      activity: []
    };
    this.categories = ["all", "chat", "rosters", "scores", "league"];
    this.handleChatSubmit = this.handleChatSubmit.bind(this);
    this.handleChatChange = this.handleChatChange.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  componentWillMount() {
    fetch('/api/activity', {
      method: "GET",
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(activity => this.setState({ activity }))
      .catch(error => console.log(error));
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on('chat message', function(res) {
      console.log(res);
    });
  }

  handleChatSubmit(e) {
    e.preventDefault();
    const message = this.state.chatInput;
    const body = JSON.stringify({ message });
    console.log(body);
    fetch('/api/activity/chat', {
      method: 'POST',
      body,
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include'
    })
      .then(response => console.log(response))
      .catch(error => console.log(error));
    this.setState({ chatInput: '' });
  }

  handleChatChange(e) {
    this.setState({ chatInput: e.target.value });
  }

  toggleCollapse() {
    this.setState({ collapseOpen: !this.state.collapseOpen });
  }

  changeFilter(category) {
    let filter = category != "all" ? category : null;
    let newState = { activityFilter: filter };
    newState.showChatInput = filter === "chat" || !filter;
    this.setState(newState);
  }

  render() {
    return (
      <div className="height-100 d-flex flex-column">
        <Collapse isOpen={this.state.collapseOpen} className="flex-grow height-100">
          <div className="d-flex flex-column height-100">

            <Nav className="nav-fill">
              {this.categories.map(category => {
                let className = this.state.activityFilter === category ? 'active' : '';
                if (!this.state.activityFilter && category === "all") className = 'active';
                return (
                  <NavItem key={category}>
                    <NavLink href="#" className={className} onClick={() => this.changeFilter(category)}>
                      <span className="text-capitalize">
                        {category}
                      </span>
                    </NavLink>
                  </NavItem>
                );
              })}
            </Nav>

            <ActivityFeed activity={this.state.activity.filter(action => {
              return this.state.activityFilter === null || action.category === this.state.activityFilter;
            })} />

            <form className={this.state.showChatInput ? '' : 'hide'} onSubmit={this.handleChatSubmit}>
              <div className="form-group my-0 pr-0">
                <input onChange={this.handleChatChange} value={this.state.chatInput} className="form-control" type="text" name="message" placeholder="Chat" autoComplete="off" />
              </div>
            </form>

          </div>
        </Collapse>
        <a href="" id="activity--collapse__toggler" onClick={this.toggleCollapse}>
          <div className="bg-dark py-2 text-center">
            Activity
          </div>
        </a>
      </div>
    );
  }
}

export default Activity;