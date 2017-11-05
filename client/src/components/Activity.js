import React, { Component } from 'react';
import { Collapse, Nav, NavItem, NavLink } from 'reactstrap';

class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      collapseOpen: true,
      activeCategory: "all",
      showChatInput: true
    };
    this.categories = ["all", "chat", "rosters", "scores", "league"];
  }

  toggleCollapse() {
    this.setState({ collapseOpen: !this.state.collapseOpen });
  }

  changeCategory(category) {
    let newState = { activeCategory: category };
    newState.showChatInput = ["all", "chat"].includes(category);
    this.setState(newState);
  }

  render() {
    return (
      <div className="height-100 d-flex flex-column">
        <Collapse isOpen={this.state.collapseOpen} className="flex-grow height-100">
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

            <div id="activity__feed" className="scroll-y pl-2 py-3 flex-grow height-100">
              Activity
            </div>

            <form className={this.state.showChatInput ? '' : 'hide'}>
              <div className="form-group my-0 pr-0">
                <input className="form-control" type="text" name="message" placeholder="Chat" autoComplete="off" />
              </div>
            </form>

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