import React, { Component } from 'react';
import { Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import FilterLink from '../../containers/FilterLink';
import ActivityList from './ActivityList';

class ActivityFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: true,
    };
    this.categories = ["all", "chat", "rosters", "scores", "league"];
    this.handleChatSubmit = this.handleChatSubmit.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  handleChatSubmit(e) {
    e.preventDefault();
    fetch('/api/activity/chat', {
      method: 'POST',
      body: JSON.stringify({ message: this.chatInput.value }),
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => console.log(response))
      .catch(error => console.log(error));
    this.chatInput.value = '';
  }

  toggleCollapse() {
    this.setState({ collapseOpen: !this.state.collapseOpen });
  }

  render() {
    return (
      <div className="height-100 d-flex flex-column">
        <Collapse isOpen={this.state.collapseOpen} className="flex-grow height-100">
          <div className="d-flex flex-column height-100">

            <Nav className="nav-fill">
              <NavItem>
                <FilterLink href="#" filter="SHOW_ALL"> All </FilterLink>
              </NavItem>
              <NavItem>
                <FilterLink href="#" filter="SHOW_CHAT"> Chat </FilterLink>
              </NavItem>
              <NavItem>
                <FilterLink href="#" filter="SHOW_ROSTERS"> Rosters </FilterLink>
              </NavItem>
              <NavItem>
                <FilterLink href="#" filter="SHOW_SCORES"> Scores </FilterLink>
              </NavItem>
              <NavItem>
                <FilterLink href="#" filter="SHOW_LEAGUE"> League </FilterLink>
              </NavItem>
            </Nav>

            <ActivityList activity={this.props.activity} />

            <form className={this.props.showChatInput ? '' : 'hide'} onSubmit={this.handleChatSubmit}>
              <div className="form-group my-0 pr-0">
                <input ref={el => this.chatInput = el} className="form-control" type="text" name="message" placeholder="Chat" autoComplete="off" />
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

export default ActivityFeed;