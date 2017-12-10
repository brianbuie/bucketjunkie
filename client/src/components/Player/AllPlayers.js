import React from 'react';
import PlayerList from 'components/Player/PlayerList';

const AllPlayers = ({ match }) => (
  <PlayerList filter={
    match.params.team
    ? { type: "TEAM", team: match.params.team }
    : { type: "SHOW_ALL" }
  } />
);

export default AllPlayers;