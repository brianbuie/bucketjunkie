import React from 'react';
import { connect } from 'react-redux';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

const mapStateToProps = (state) => ({
  isLoggedIn: state.user._id ? true : false
});

const MenuLink = ({ href, text }, key) => (
  <NavItem key={key}>
    <NavLink href={href}>
      {text}
    </NavLink>
  </NavItem>
);

const Menu = connect(mapStateToProps)(({ isLoggedIn }) => {
  let menuItems = isLoggedIn
  ? [
      { text: 'Account', href: "/account" },
      { text: 'Logout', href: "/account/logout" }
    ]
  : [
      { text: 'Login', href: '/account/login' }
    ];
  return (
    <Navbar color="dark" className="justify-content-between">
      <NavbarBrand href="/">
        <img src="/images/logo.svg" />
      </NavbarBrand>
      <Nav className="navbar-expand">
        {menuItems.map((menuItem, key) => MenuLink(menuItem, key))}
      </Nav>
    </Navbar>
  );
});

export default Menu;