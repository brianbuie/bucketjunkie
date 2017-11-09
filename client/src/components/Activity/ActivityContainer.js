import { connect } from 'react-redux';
import { setActivityFilter } from '../../actions';
import Activity from './Activity';

const getVisibleActivity = (items, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return items;
    case 'SHOW_CHAT':
      return items.filter(a => a.category === 'chat');
    case 'SHOW_ROSTERS':
      return items.filter(a => a.category === 'rosters');
    case 'SHOW_SCORES':
      return items.filter(a => a.category === 'scores');
    case 'SHOW_LEAGUE':
      return items.filter(a => a.category === 'league');
    default:
      throw new Error(`Unknown filter: ${filter}`);
  }
};

const showChatInput = (filter) => {
  return ['SHOW_ALL', 'SHOW_CHAT'].includes(filter);
}

const mapStateToProps = (state) => ({
  items: getVisibleActivity(state.activity.items, state.activity.filter),
  showChatInput: showChatInput(state.activity.filter)
});

const mapDispatchToProps = {
  onActivityFilterClick: setActivityFilter
};

const ActivityContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Activity);

export default ActivityContainer;