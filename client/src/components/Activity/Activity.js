import './Activity.scss';

import React from 'react';
import { connect } from 'react-redux';
import { setActivityFilter, sendChat } from 'actions';
import ActivityMenu from 'components/Activity/ActivityMenu';
import ActivityList from 'components/Activity/ActivityList';
import ChatForm from 'components/Activity/ChatForm';

const Activity = ({ items, showChatInput, setActivityFilter, activeFilter, filters, chatSubmit }) => (
  <div className="Activity__Container d-flex flex-column">
    <ActivityMenu setActivityFilter={setActivityFilter} activeFilter={activeFilter} />
    <ActivityList items={items} />
    {showChatInput ? <ChatForm chatSubmit={chatSubmit} /> : ''}
  </div>
);

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
  activeFilter: state.activity.filter,
  items: getVisibleActivity(state.activity.items, state.activity.filter),
  showChatInput: showChatInput(state.activity.filter),
});

const mapDispatchToProps = dispatch => ({
  setActivityFilter: filter => dispatch(setActivityFilter(filter)),
  chatSubmit: input => dispatch(sendChat(input)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activity);