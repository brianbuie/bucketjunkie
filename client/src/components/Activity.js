import React, { Component } from 'react';
import { Collapse, Nav, NavItem, NavLink } from 'reactstrap';
const io = require('socket.io-client');

class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      collapseOpen: true,
      activeCategory: "all",
      showChatInput: true,
      chatInput: '',
    };
    this.categories = ["all", "chat", "rosters", "scores", "league"];
    this.handleChatSubmit = this.handleChatSubmit.bind(this);
    this.handleChatChange = this.handleChatChange.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on('chat message', function(res) {
      console.log(res);
    });
  }

  handleChatSubmit(e) {
    e.preventDefault();
    this.socket.emit('chat message', this.state.chatInput);
    this.setState({ chatInput: '' });
  }

  handleChatChange(e) {
    this.setState({ chatInput: e.target.value });
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