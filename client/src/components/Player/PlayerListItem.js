import React from 'react';
import { Row, Col } from 'reactstrap';
import { A } from 'components/Utilities';
import { ImageRound } from 'components/UI';
import TeamIcon from 'components/Team/TeamIcon';
import PlayerRosterButton from 'components/Player/PlayerRosterButton';

const PlayerListItem = props => (
  <div className="flex-row align-items-center py-2 px-3">
    <A className="flex-grow" click={() => props.viewPlayer(props.id)}>
      <Row noGutters>
        <Col xs="2" className="flex-column justify-content-center pr-2">
          <ImageRound path={props.image} />
        </Col>
        <Col xs="8" className="flex-column justify-content-center pr-2">
          <h5 className="font-weight-normal text-truncate">
            {props.name}
          </h5>
          <span className="faded-3">
            {props.position}
          </span>
        </Col>
        <Col xs="2" className="flex-column justify-content-center text-center">
          <h3>
            {Math.round(props.score) || 0}
          </h3>
        </Col>
      </Row>
    </A>
    <PlayerRosterButton 
      id={props.id}
      availableAction={props.availableAction}
      addPlayer={props.addPlayer}
      removePlayer={props.removePlayer}
    />
  </div>
);

export default PlayerListItem;