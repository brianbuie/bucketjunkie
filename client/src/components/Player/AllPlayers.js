import React from 'react';
import { Row, Col } from 'reactstrap';
import { Panel } from 'components/UI';
import PlayerList from 'components/Player/PlayerList';
import TeamContainer from 'components/Team/TeamContainer';
import TeamHeading from 'components/Team/TeamHeading';

const AllPlayers = ({ match }) => (
  <div>
    <TeamContainer id={match.params.team} component={TeamHeading} />
    <Panel>
      <PlayerList filter={
        match.params.team
        ? { type: "TEAM", team: match.params.team }
        : { type: "SHOW_ALL" }
      } />
    </Panel>
  </div>
);

export default AllPlayers;