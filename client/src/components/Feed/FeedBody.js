import React from 'react';
import { connect } from 'react-redux';
import { changeFeedView } from 'actions';
import A from 'components/Utilities/A';
import Scrollbars from 'react-custom-scrollbars';
import LeagueOverviewConnected from 'components/League/LeagueOverviewConnected';
import EditLeague from 'components/League/EditLeague';
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

const FeedMenu = ({ active, changeView }) => (
  <div className="LeagueFeed__Menu">
    {menuItems.map(item => (
      <A 
        className="LeagueFeed__Menu__Item py-2"
        click={() => changeView(item.name)} 
        active={active === item.name}
        key={item.name}
      >
        {item.text}
      </A>
    ))}
  </div>
);

const FeedBody = ({ view, changeView }) => {
  if (['LEAGUE_INFO', 'LEAGUE_EDIT'].includes(view)) return (
    <div className="LeagueFeed">
      <FeedMenu active='LEAGUE_INFO' changeView={changeView} />
      <Scrollbars autoHide>
        <div className="p-3">
          {view === 'LEAGUE_INFO' ? (
            <LeagueOverviewConnected goToLeagueEdit={() => changeView('LEAGUE_EDIT')}/>
          ) : (
            <EditLeague />
          )}
        </div>
      </Scrollbars>
    </div>
  );

  let activityView = activityViews.find(v => v.name === view);
  return (
    <div className="LeagueFeed">
      <FeedMenu active={view} changeView={changeView} />
      {activityView && <ActivityList filter={activityView.filter} />}
      {activityView && (activityView.showChat ? <ChatForm /> : '')}
    </div>
  );
};

export default connect(
  ({ feed }) => ({ view: feed.view }),
  dispatch => ({
    changeView: view => dispatch(changeFeedView(view))
  })
)(FeedBody);