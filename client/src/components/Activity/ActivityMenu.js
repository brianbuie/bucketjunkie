import React from 'react';
import { A } from 'components/Utilities';

const filters = [
  { filter: 'SHOW_ALL', text: 'All' },
  { filter: 'SHOW_CHAT', text: 'Chat' },
  { filter: 'SHOW_ROSTERS', text: 'Rosters' },
  { filter: 'SHOW_SCORES', text: 'Scores' },
  { filter: 'SHOW_LEAGUE', text: 'League' },
];

const ActivityMenu = ({ setActivityFilter, activeFilter }) => (
  <div>
    <div className="Activity__Menu">
      {filters.map(filter => (
        <A 
          className="Activity__Menu__Item"
          click={() => setActivityFilter(filter.filter)} 
          active={activeFilter === filter.filter}
          key={filter.filter}
        >
          {filter.text}
        </A>
      ))}
    </div>
  </div>
);

export default ActivityMenu;