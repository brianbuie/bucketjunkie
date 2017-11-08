import { connect } from 'react-redux';
import { setActivityFilter } from '../actions';
import ActivityFeed from '../components/Activity/ActivityFeed';

const getVisibleActivity = (activity, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return activity;
    case 'SHOW_CHAT':
      return activity.filter(a => a.category === 'chat');
    case 'SHOW_ROSTERS':
      return activity.filter(a => a.category === 'rosters');
    case 'SHOW_SCORES':
      return activity.filter(a => a.category === 'scores');
    case 'SHOW_LEAGUE':
      return activity.filter(a => a.category === 'league');
    default:
      throw new Error(`Unknown filter: ${filter}`);
  }
};

const showChatInput = (filter) => {
  return ['SHOW_ALL', 'SHOW_CHAT'].includes(filter);
}

const mapStateToProps = (state) => ({
  activity: getVisibleActivity(state.activity, state.activityFilter),
  showChatInput: showChatInput(state.activityFilter)
});

const mapDispatchToProps = {
  onActivityFilterClick: setActivityFilter
};

const ActivityContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityFeed);

export default ActivityContainer;