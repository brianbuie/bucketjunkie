import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, } from 'reactstrap';
import { A } from 'components/Utilities';
import { submitLogout } from 'actions';
import routes from 'routes';

const Menu = ({ user, logout }) => (
  <Navbar color="dark" className="justify-content-between">
    <NavbarBrand href="/">
      <img src="/images/logo.svg" />
    </NavbarBrand>
      {user 
      ? <Nav className="navbar-expand">
          <NavItem>
            <Link to={routes.rosters} className="nav-link"> Dash </Link>
          </NavItem>
          <NavItem>
            <Link to={routes.account} className="nav-link"> Account </Link>
          </NavItem>
          <NavItem>
            <A className="nav-link" click={() => logout()}> Logout </A>
          </NavItem>
        </Nav>
      : <Nav className="navbar-expand">
          <NavItem>
            <Link to={routes.login} className="nav-link"> Login </Link>
          </NavItem>
        </Nav>
      }
  </Navbar>
);

const mapStateToProps = ({ user }) => ({ user });

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(submitLogout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);