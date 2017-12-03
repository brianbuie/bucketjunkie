import React from 'react';
import { connect } from 'react-redux';
import Activity from 'components/Activity/Activity';
import LoginForm from 'components/Account/LoginForm';

const FeedBody = ({ user, league, myLeagues }) => {
  if (league) return <Activity />
  if (!user) return <LoginForm />
  return '';
};

const mapStateToProps = ({ user, league, myLeagues }) => ({ user, league, myLeagues });

export default connect(
  mapStateToProps
)(FeedBody);