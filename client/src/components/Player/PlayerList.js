import { connect } from 'react-redux';
import React from 'react';
import Player from './Player';

const PlayerListComponent = ({ players }) => (
  <div className="bg-light">
    {players.map(player => (
      <Player player={player} key={player._id}/>
    ))}
  </div>
);

const mapStateToProps = (state) => ({
  players: state.players.sort((a,b) => {
    if (a.score < b.score) return 1;
    if (a.score > b.score) return -1;
    return 0;
  }).splice(0,50)
});

const PlayerList = connect(
  mapStateToProps
)(PlayerListComponent);

export default PlayerList;