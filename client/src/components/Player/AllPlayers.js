import React from 'react';
import { Row, Col } from 'reactstrap';
import { Panel } from 'components/UI';
import PlayerList from 'components/Player/PlayerList';
import TeamHeading from 'components/Team/TeamHeading';


const AllPlayers = ({ match }) => (
  <div>
    <TeamHeading id={match.params.team} />
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