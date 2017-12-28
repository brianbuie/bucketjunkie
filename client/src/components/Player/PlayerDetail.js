import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import { A } from 'components/Utilities';
import { ImageRound, Panel } from 'components/UI';
import TeamIcon from 'components/Team/TeamIcon';
import TeamContainer from 'components/Team/TeamContainer';
import UpcomingGames from 'components/Player/UpcomingGames';
import PlayerAverages from 'components/Player/PlayerAverages';
import PlayerRosterButton from 'components/Player/PlayerRosterButton';

const PlayerDetail = (props) => (
  <div className="position-relative">
    <Button className="close" onClick={props.close}>
      &times;
    </Button>
    <div className="flex-row align-items-center px-3">
      <Row className="no-gutters py-3 flex-grow">
        <Col xs="2" className="flex-column justify-content-center position-relative">
          <ImageRound path={props.image} />
        </Col>
        <Col xs="8" className="px-2 flex-column justify-content-center">
          <h4 className="font-weight-normal text-truncate mb-2">
            {props.name}
          </h4>
          <p className="m-0 text-truncate">
            <TeamIcon id={props.team} style={{ width: '10%', marginRight: '5px' }}/>
            <TeamContainer id={props.team} component={props => (
              <span className="faded-3">
                {`${props.city} ${props.name}`}
              </span>
            )} />
            <span className="faded-3">
              {` | ${props.position}`}
            </span>
          </p>
        </Col>
        <Col xs="2" className="flex-column justify-content-center text-center">
          <h1 className="m-0">
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
    <Panel className="p-3">
      <h5 className="font-weight-normal pb-3 faded-2">Upcoming Games</h5>
      <UpcomingGames upcomingGames={props.upcomingGames} team={props.team} />
    </Panel>
    <PlayerAverages averages={props.averages} />
  </div>
);

export default PlayerDetail;