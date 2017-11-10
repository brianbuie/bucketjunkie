import React, { Component } from 'react';
import { Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import FilterLink from './FilterLink';
import ActivityList from './ActivityList';
import ChatForm from './ChatForm';

class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: true,
    };
    this.toggleCollapse = this.toggleCollapse.bind(this);
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
            <ActivityList items={this.props.items} />
            {this.props.showChatInput ? <ChatForm /> : ''}
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