import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import { A } from 'components/Utilities';
import { ImageRound, Panel } from 'components/UI';
import TeamIcon from 'components/Team/TeamIcon';
import TeamContainer from 'components/Team/TeamContainer';
import UpcomingGames from 'components/Player/UpcomingGames';
import PlayerAverages from 'components/Player/PlayerAverages';
import PlayerBoxscores from 'components/Player/PlayerBoxscores';
import PlayerRosterButton from 'components/Player/PlayerRosterButton';

const PlayerDetail = ({ close, image, name, team, position, score, _id, availableAction, addPlayer, removePlayer, upcomingGames, averages }) => (
  <div>
    <div className="flex-row justify-content-end position-relative PlayerDetail__close__wrapper">
      <Button className="close PlayerDetail__close" onClick={close}>
        &times;
      </Button>
    </div>
    <div className="flex-row align-items-center">
      <Row className="no-gutters py-3 flex-grow">
        <Col xs="2" className="flex-column justify-content-center position-relative">
          <ImageRound path={image} />
        </Col>
        <Col xs="8" className="px-2 flex-column justify-content-center">
          <h4 className="font-weight-normal text-truncate mb-2">
            {name}
          </h4>
          <p className="m-0 text-truncate">
            <TeamIcon id={team} style={{ width: '10%', marginRight: '5px' }}/>
            <TeamContainer id={team} component={({ city, name }) => (
              <span className="faded-3">
                {`${city} ${name}`}
              </span>
            )} />
            <span className="faded-3">
              {` | ${position}`}
            </span>
          </p>
        </Col>
        <Col xs="2" className="flex-column justify-content-center text-center">
          <h1 className="m-0">
            {Math.round(score) || 0}
          </h1>
          <p className="faded-2 m-0">AVG</p>
        </Col>
      </Row>
      <PlayerRosterButton 
        id={_id}
        availableAction={availableAction}
        addPlayer={addPlayer}
        removePlayer={removePlayer}
      />
    </div>
    <Panel className="p-3">
      <h5 className="font-weight-normal pb-3 faded-2">Upcoming Games</h5>
      <UpcomingGames upcomingGames={upcomingGames} team={team} />
    </Panel>
    <PlayerAverages averages={averages} score={Math.round(score) || 0} />
    <PlayerBoxscores id={_id} />
  </div>
);

export default PlayerDetail;