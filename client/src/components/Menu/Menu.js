import React from 'react';
import { connect } from 'react-redux';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

const Menu = ({ items }) => (
  <Navbar color="dark" className="justify-content-between">
    <NavbarBrand href="/">
      <img src="/images/logo.svg" />
    </NavbarBrand>
    <Nav className="navbar-expand">
      {items.map((item, key) => (
        <NavItem key={key}>
          <NavLink href={item.href}>
            {item.text}
          </NavLink>
        </NavItem>
      ))}
    </Nav>
  </Navbar>
);

const getMenuItems = user => (
  user
  ? [
      { text: 'Account', href: "/account" },
      { text: 'Logout', href: "/account/logout" }
    ]
  : [
      { text: 'Login', href: '/account/login' }
    ]
);

const mapStateToProps = (state) => ({
  items: getMenuItems(state.user)
});

export default connect(
  mapStateToProps
)(Menu);