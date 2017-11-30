import React from 'react';
import { connect } from 'react-redux';
import { 
  setActivityFilter, 
  sendChat,
  minimizeActivity,
  maximizeActivity,
  dockActivity,
  undockActivity
} from 'actions';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { A } from 'components/Utilities';
import ActivityList from 'components/Activity/ActivityList';
import AccountLauncher from 'components/Account/AccountLauncher';
import ActivityMenuBar from 'components/Activity/ActivityMenuBar';
import ChatForm from 'components/Activity/ChatForm';
import './Activity.scss';

const Activity = ({ 
  items, 
  showChatInput, 
  filterClick, 
  activeFilter, 
  filters, 
  chatSubmit,
  docked,
  minimized,
}) => (
  <div className={`${docked ? 'docked' : 'undocked'} ${minimized ? 'minimized' : 'maximized'} justify-content-end activity__container`}>
    <div className="height-100 d-flex flex-column">
      <ActivityMenuBar />
      <Nav className="nav-fill">
        {filters.map(filter => (
          <NavItem key={filter.filter}>
            <A 
              className="nav-link text-small" 
              click={() => filterClick(filter.filter)} 
              active={activeFilter === filter.filter}
            >
              {filter.text}
            </A>
          </NavItem>
        ))}
      </Nav>
      <ActivityList items={items} />
      {showChatInput ? <ChatForm chatSubmit={chatSubmit} /> : ''}
    </div>
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

const filters = [
  { filter: 'SHOW_ALL', text: 'All' },
  { filter: 'SHOW_CHAT', text: 'Chat' },
  { filter: 'SHOW_ROSTERS', text: 'Rosters' },
  { filter: 'SHOW_SCORES', text: 'Scores' },
  { filter: 'SHOW_LEAGUE', text: 'League' },
];

const showChatInput = (filter) => {
  return ['SHOW_ALL', 'SHOW_CHAT'].includes(filter);
}

const mapStateToProps = (state) => ({
  filters,
  activeFilter: state.activity.filter,
  items: getVisibleActivity(state.activity.items, state.activity.filter),
  showChatInput: showChatInput(state.activity.filter),
  docked: state.activity.docked,
  minimized: state.activity.minimized,
});

const mapDispatchToProps = dispatch => ({
  filterClick: filter => dispatch(setActivityFilter(filter)),
  chatSubmit: input => dispatch(sendChat(input)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activity);