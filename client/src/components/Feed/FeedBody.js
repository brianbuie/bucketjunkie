import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { changeFeedView } from 'actions';
import Activity from 'components/Activity/Activity';
import LoginForm from 'components/Account/LoginForm';
import RegisterForm from 'components/Account/RegisterForm';
import ForgotPasswordForm from 'components/Account/ForgotPasswordForm';
import ResetPasswordForm from 'components/Account/ResetPasswordForm';
import MyLeagues from 'components/League/MyLeagues';

const FeedBody = ({ view, changeView, loc }) => {
  let token = queryString.parse(loc.search)['password-reset'];
  if (token) return <ResetPasswordForm token={token} />
  switch (view) {
    case 'ACTIVITY':
      return <Activity />
    case 'LOGIN':
      return <LoginForm goToRegister={() => changeView('REGISTER')} goToForgotPassword={() => changeView('FORGOT_PASSWORD')} />
    case 'REGISTER':
      return <RegisterForm goToLogin={() => changeView('LOGIN')} />
    case 'FORGOT_PASSWORD':
      return <ForgotPasswordForm goToLogin={() => changeView('LOGIN')} />
    case 'MY_LEAGUES':
      return <MyLeagues />
    default:
      return '';
  }
};

const mapStateToProps = ({ feed, router }) => ({ view: feed.view, loc: router.location });

const mapDispatchToProps = dispatch => ({
  changeView: view => dispatch(changeFeedView(view))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedBody);