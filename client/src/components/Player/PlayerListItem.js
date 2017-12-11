import React from 'react';
import { Row, Col } from 'reactstrap';
import { A } from 'components/Utilities';
import { ImageRound, Container } from 'components/Utilities/ui';
import TeamIcon from 'components/Team/TeamIcon';
import PlayerRosterButton from 'components/Player/PlayerRosterButton';

const PlayerListItem = (props) => (
  <Container size="2">
    <div className="d-flex flex-row align-items-center">
      <A className="flex-grow" click={() => props.viewPlayer(props.id)}>
        <Row noGutters>
          <Col xs="2" className="d-flex flex-column justify-content-center">
            <Container size="1">
              <ImageRound path={props.image} />
            </Container>
          </Col>
          <Col xs="8" className="d-flex flex-column justify-content-center">
            <Container size="2">
              <h5 className="font-weight-normal text-truncate">
                {props.name}
              </h5>
              <span className="faded-3">
                {props.position}
              </span>
            </Container>
          </Col>
          <Col xs="2" className="d-flex flex-column justify-content-center text-center">
            <h4>
              {Math.round(props.score) || 0}
            </h4>
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
  </Container>
);

export default PlayerListItem;