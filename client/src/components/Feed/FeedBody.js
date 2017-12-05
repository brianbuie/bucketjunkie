import React from 'react';
import { connect } from 'react-redux';
import { changeFeedView } from 'actions';
import LoginForm from 'components/Account/LoginForm';
import RegisterForm from 'components/Account/RegisterForm';
import ForgotPasswordForm from 'components/Account/ForgotPasswordForm';
import ResetPasswordForm from 'components/Account/ResetPasswordForm';
import Activity from 'components/Activity/Activity';
import MyLeagues from 'components/League/MyLeagues';
import LeagueInfo from 'components/League/LeagueInfo';

const FeedBody = ({ view, changeView }) => {
  switch (view) {
    case 'ACTIVITY':
      return <Activity />
    case 'LOGIN':
      return <LoginForm goToRegister={() => changeView('REGISTER')} goToForgotPassword={() => changeView('FORGOT_PASSWORD')} />
    case 'REGISTER':
      return <RegisterForm goToLogin={() => changeView('LOGIN')} />
    case 'FORGOT_PASSWORD':
      return <ForgotPasswordForm goToLogin={() => changeView('LOGIN')} />
    case 'RESET_PASSWORD':
      return <ResetPasswordForm />
    case 'MY_LEAGUES':
      return <MyLeagues />
    case 'LEAGUE_INFO':
      return <LeagueInfo />
    default:
      return '';
  }
};

const mapStateToProps = ({ feed }) => ({ view: feed.view });

const mapDispatchToProps = dispatch => ({
  changeView: view => dispatch(changeFeedView(view))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedBody);