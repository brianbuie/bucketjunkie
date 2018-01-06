import React from 'react';
import { Panel } from 'components/UI';
import PlayerList from 'components/Player/PlayerList';
import TeamContainer from 'components/Team/TeamContainer';
import TeamHeading from 'components/Team/TeamHeading';
import PlayerDetailLayout from 'components/Layout/PlayerDetailLayout';

const AllPlayers = ({ match }) => (
  <PlayerDetailLayout>
    <TeamContainer id={match.params.team} component={TeamHeading} />
    <Panel>
      <PlayerList filter={
        match.params.team
        ? { type: "TEAM", team: match.params.team }
        : { type: "SHOW_ALL" }
      } />
    </Panel>
  </PlayerDetailLayout>
);

export default AllPlayers;