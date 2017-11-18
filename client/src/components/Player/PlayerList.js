import { connect } from 'react-redux';
import React from 'react';
import PlayerContainer from './PlayerContainer';
import { sortByScore } from '../../helpers';

const filterPlayers = (players, filter = { type: 'SHOW_ALL' }) => {
  switch (filter.type) {
    case 'LIST':
      return players.filter(p => filter.list.map(lp => lp._id || lp).includes(p._id));
    case 'TEAM':
      return players.filter(p => p.team == filter.team).sort(sortByScore);
    case 'SHOW_ALL':
      return players.sort(sortByScore).filter((p, k) => k <= 30);
  }
}

const mapStateToProps = (state, ownProps) => ({
  players: filterPlayers(state.players, ownProps.filter)
});

const PlayerList = ({ players }) => (
  <div className="bg-light">
    {players.map(player => (
      <PlayerContainer id={player._id} key={player._id}/>
    ))}
  </div>
);

export default connect(
  mapStateToProps
)(PlayerList);