import React from 'react';
import { Row, Col } from 'reactstrap';
import A from 'components/Utilities/A';
import { ImageRound } from 'components/UI';
import TeamIcon from 'components/Team/TeamIcon';
import PlayerRosterButton from 'components/Player/PlayerRosterButton';

const PlayerListItem = ({
  id,
  image,
  name,
  position,
  score,
  viewPlayer = () => {},
  availableAction,
  addPlayer,
  removePlayer
}) => (
  <div className="flex-row align-items-center py-2 px-3">
    <A className="flex-grow" click={() => viewPlayer(id)}>
      <Row noGutters>
        <Col xs="2" className="flex-column justify-content-center pr-2">
          <ImageRound path={image} />
        </Col>
        <Col xs="8" className="flex-column justify-content-center pr-2">
          <h5 className={`font-weight-normal text-truncate ${!name && 'faded-3'}`}>
            {id ? name : '(empty)'}
          </h5>
          <span className="faded-3">
            {position}
          </span>
        </Col>
        <Col xs="2" className="flex-column justify-content-center text-center">
          <h3 className={`${!id && 'faded-3'}`}>
            {Math.round(score) || 0}
          </h3>
        </Col>
      </Row>
    </A>
    <PlayerRosterButton 
      id={id}
      availableAction={availableAction}
      addPlayer={addPlayer}
      removePlayer={removePlayer}
    />
  </div>
);

export default PlayerListItem;