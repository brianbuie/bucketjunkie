import React from 'react';
import { Row, Col } from 'reactstrap';
import { A } from 'components/Utilities';
import { ImageRound } from 'components/Utilities/ui';
import TeamIcon from 'components/Team/TeamIcon';
import PlayerRosterButton from 'components/Player/PlayerRosterButton';

const PlayerListItem = (props) => (
  <div className="striped d-flex flex-row align-items-center px-3 width-100">
    <Row className="no-gutters py-1 flex-grow">
      <Col xs="2" className="d-flex flex-column justify-content-center py-1">
        <ImageRound path={props.image} />
      </Col>
      <Col xs="8" className="px-2 d-flex flex-column justify-content-center">
        <A className="link-discreet" click={() => props.viewPlayer(props.id)}>
          <h4 className="mb-2 font-weight-normal text-truncate">
            {props.name}
          </h4>
        </A>
      </Col>
      <Col xs="2" className="d-flex flex-column justify-content-center text-center">
        <h2 className="faded-1 m-0">
          {Math.round(props.score) || 0}
        </h2>
        <small className="faded-2 m-0">AVG</small>
      </Col>
    </Row>
    <PlayerRosterButton 
      id={props.id}
      availableAction={props.availableAction}
      addPlayer={props.addPlayer}
      removePlayer={props.removePlayer}
    />
  </div>
);

export default PlayerListItem;