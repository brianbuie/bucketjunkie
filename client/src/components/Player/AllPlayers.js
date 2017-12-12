import React from 'react';
import { Panel } from 'components/UI';
import PlayerList from 'components/Player/PlayerList';

const AllPlayers = ({ match }) => (
  <Panel>
    <PlayerList filter={
      match.params.team
      ? { type: "TEAM", team: match.params.team }
      : { type: "SHOW_ALL" }
    } />
  </Panel>
);

export default AllPlayers;