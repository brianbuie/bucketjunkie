import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, } from 'reactstrap';
import routes from '../../routes';

const Menu = ({ items }) => (
  <Navbar color="dark" className="justify-content-between">
    <NavbarBrand href="/">
      <img src="/images/logo.svg" />
    </NavbarBrand>
    <Nav className="navbar-expand">
      {items.map((item, key) => (
        <NavItem key={key}>
          <Link to={item.to} className="nav-link">
            {item.text}
          </Link>
        </NavItem>
      ))}
    </Nav>
  </Navbar>
);

const getMenuItems = user => (
  user
  ? [
      { text: 'Dash', to: routes.rosters },
      { text: 'Account', to: routes.account },
      { text: 'Logout', to: routes.logout }
    ]
  : [
      { text: 'Login', to: routes.login }
    ]
);

const mapStateToProps = (state) => ({
  items: getMenuItems(state.user)
});

export default connect(
  mapStateToProps
)(Menu);