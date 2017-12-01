import React from 'react';
import PlayerList from 'components/Player/PlayerList';

const AllPlayers = ({ match }) => (
  <div className="bg-light">
    <PlayerList filter={
      match.params.team
      ? { type: "TEAM", team: match.params.team }
      : { type: "SHOW_ALL" }
    } />
  </div>
);

export default AllPlayers;