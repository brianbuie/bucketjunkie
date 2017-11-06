import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

const Menu = () => (
  <Navbar color="dark" className="justify-content-between">
    <NavbarBrand href="/">
      <img src="/images/logo.svg" />
    </NavbarBrand>
    <Nav className="navbar-expand">
      <NavItem>
        <NavLink href='/'>
          Link
        </NavLink>
      </NavItem>
    </Nav>
  </Navbar>
);

export default Menu;