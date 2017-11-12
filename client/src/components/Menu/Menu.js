import React from 'react';
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

export default Menu;