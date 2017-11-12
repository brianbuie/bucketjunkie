import React from 'react';
import { connect } from 'react-redux';
import Menu from './Menu';

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