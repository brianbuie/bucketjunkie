import { connect } from 'react-redux';
import React from 'react';
import PlayerContainer from 'components/Player/PlayerContainer';
import PlayerListItem from 'components/Player/PlayerListItem';
import { sortByScore } from 'helpers';

const filterPlayers = (players, filter = { type: 'SHOW_ALL' }, limit) => {
  switch (filter.type) {
    case 'LIST':
      return players.filter(p => filter.list.map(lp => lp._id || lp).includes(p._id));
    case 'SORTED_LIST':
      return players.filter(p => filter.list.map(lp => lp._id || lp).includes(p._id)).sort(sortByScore);
    case 'TEAM':
      return players.filter(p => p.team == filter.team).sort(sortByScore);
    case 'SHOW_ALL':
      return players.sort(sortByScore).filter((p, k) => !limit || k <= limit);
  }
}

const PlayerList = ({ players, filter, limit }) => (
  <div>
    {filterPlayers(players, filter, limit)
      .map(player => (
        <PlayerContainer id={player._id} key={player._id} component={PlayerListItem} />
      ))
    }
  </div>
);

export default connect(
  ({ players }) => ({ players })
)(PlayerList);