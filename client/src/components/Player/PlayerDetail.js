import React from 'react';
import { Row, Col } from 'reactstrap';
import { A } from 'components/Utilities';
import { ImageRound } from 'components/UI';
import UpcomingGames from 'components/Player/UpcomingGames';
import PlayerAverages from 'components/Player/PlayerAverages';
import PlayerRosterButton from 'components/Player/PlayerRosterButton';

const PlayerDetail = (props) => (
  <div className="d-flex flex-row align-items-center px-3">
    <Row className="no-gutters py-3 flex-grow">
      <Col xs="2" className="d-flex flex-column justify-content-center">
        <ImageRound path={props.image} />
      </Col>
      <Col xs="8" className="px-2">
        <h4 className="font-weight-normal text-truncate">
          {props.name}
        </h4>
        {props.showAverages
          ? <PlayerAverages averages={props.averages} />
          : <UpcomingGames upcomingGames={props.upcomingGames} team={props.team} />
        }
      </Col>
      <Col xs="2" className="d-flex flex-column justify-content-center text-center">
        <h1 className="faded-1 m-0">
          {Math.round(props.score) || 0}
        </h1>
        <p className="faded-2 m-0">AVG</p>
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

export default PlayerDetail;