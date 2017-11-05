import React, { Component } from 'react';
import { Collapse, Nav, NavItem, NavLink } from 'reactstrap';

class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      collapseOpen: true,
      activeCategory: "all"
    };
    this.categories = ["all", "chat", "rosters", "scores", "league"];
  }

  toggleCollapse() {
    this.setState({ collapseOpen: !this.state.collapseOpen });
  }

  changeCategory(category) {
    this.setState({ activeCategory: category });
  }

  render() {
    return (
      <div className="height-100 d-flex flex-column">
        <Collapse isOpen={this.state.collapseOpen} className="flex-grow">
          <div className="d-flex flex-column height-100">
            <Nav className="nav-fill">
              {this.categories.map(category => {
                const className = this.state.activeCategory === category ? 'active' : '';
                return (
                  <NavItem key={category}>
                    <NavLink href="#" className={className} onClick={() => this.changeCategory(category)}>
                      <span className="text-capitalize">
                        {category}
                      </span>
                    </NavLink>
                  </NavItem>
                );
              })}
            </Nav>
            <div id="activity__feed scroll-y pl-2 py-3 flex-grow height-100">
            </div>
          </div>
        </Collapse>
        <a href="" id="activity--collapse__toggler" onClick={() => this.toggleCollapse}>
          <div className="bg-dark py-2 text-center">
            Activity
          </div>
        </a>
      </div>
    );
  }
}

export default Activity;