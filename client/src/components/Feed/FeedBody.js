import React from 'react';
import { connect } from 'react-redux';
import { changeFeedView } from 'actions';
import LoginForm from 'components/Account/LoginForm';
import RegisterForm from 'components/Account/RegisterForm';
import ForgotPasswordForm from 'components/Account/ForgotPasswordForm';
import ResetPasswordForm from 'components/Account/ResetPasswordForm';
import MyLeagues from 'components/League/MyLeagues';
import LeagueFeedMenu from 'components/Feed/LeagueFeedMenu';
import ActivityList from 'components/Activity/ActivityList';
import ChatForm from 'components/Activity/Chatform';

const activityViews = [
  { name: 'ACTIVITY_ALL', text: 'All', showChat: true },
  { name: 'ACTIVITY_CHAT', text: 'Chat', filter: 'chat', showChat: true },
  { name: 'ACTIVITY_ROSTERS', text: 'Rosters', filter: 'rosters', showChat: false },
  { name: 'ACTIVITY_SCORES', text: 'Scores', filter: 'scores', showChat: false },
  { name: 'ACTIVITY_LEAGUE', text: 'League', filter: 'league', showChat: false },
];

const FeedBody = ({ view, changeView }) => {
  // account views
  switch (view) {
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
  }
  // activity views
  let activityView = activityViews.filter(v => v.name === view)[0];
  if (!!activityView) return (
    <div className="LeagueFeed">
      <LeagueFeedMenu view={view} changeView={changeView} menuItems={activityViews} />
      <ActivityList filter={activityView.filter} />
      {activityView.showChat ? <ChatForm /> : ''}
    </div>
  );
};

const mapStateToProps = ({ feed }) => ({ view: feed.view });

const mapDispatchToProps = dispatch => ({
  changeView: view => dispatch(changeFeedView(view))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedBody);