import React from 'react';
import { connect } from 'react-redux';
import { changeFeedView } from 'actions';
import Scrollbars from 'react-custom-scrollbars';
import LoginForm from 'components/Account/LoginForm';
import RegisterForm from 'components/Account/RegisterForm';
import ForgotPasswordForm from 'components/Account/ForgotPasswordForm';
import ResetPasswordForm from 'components/Account/ResetPasswordForm';
import MyLeagues from 'components/League/MyLeagues';
import LeagueInfo from 'components/League/LeagueInfo';
import EditLeague from 'components/League/EditLeague';
import LeagueFeedMenu from 'components/Feed/LeagueFeedMenu';
import ActivityList from 'components/Activity/ActivityList';
import ChatForm from 'components/Activity/ChatForm';

const activityViews = [
  { name: 'ACTIVITY_ALL', text: 'All', showChat: true },
  { name: 'ACTIVITY_CHAT', text: 'Chat', filter: 'chat', showChat: true },
  { name: 'ACTIVITY_ROSTERS', text: 'Rosters', filter: 'rosters', showChat: false },
  { name: 'ACTIVITY_SCORES', text: 'Scores', filter: 'scores', showChat: false },
];

const leagueViews = [
  { name: 'LEAGUE_INFO', text: 'League' }
];

const menuItems = activityViews.concat(leagueViews);

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
    case 'LEAGUE_INFO':
      return (
        <div className="LeagueFeed">
          <LeagueFeedMenu view={view} changeView={changeView} menuItems={menuItems} />
          <LeagueInfo goToLeagueEdit={() => changeView('LEAGUE_EDIT')}/>
        </div>
      );
    case 'LEAGUE_EDIT':
      return (
        <div className="LeagueFeed">
          <LeagueFeedMenu view='LEAGUE_INFO' changeView={changeView} menuItems={menuItems} />
          <Scrollbars>
            <EditLeague />
          </Scrollbars>
        </div>
      );
  }
  // activity views
  let activityView = activityViews.filter(v => v.name === view)[0];
  if (!!activityView) return (
    <div className="LeagueFeed">
      <LeagueFeedMenu view={view} changeView={changeView} menuItems={menuItems} />
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