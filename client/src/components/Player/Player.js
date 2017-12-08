import React from 'react';
import { Row, Col } from 'reactstrap';
import routes from 'routes';
import { A } from 'components/Utilities';
import { ImageRound } from 'components/Utilities/ui';
import TeamIcon from 'components/Team/TeamIcon';
import UpcomingGames from 'components/Player/UpcomingGames';
import PlayerAverages from 'components/Player/PlayerAverages';
import PlayerRosterButton from 'components/Player/PlayerRosterButton';

const Player = ({ 
  id, 
  name,
  averages,
  image, 
  upcomingGames, 
  team, 
  score = 0, 
  availableAction, 
  addPlayer, 
  removePlayer,
  viewPlayer,
  showAverages,
}) => (
  <div className="striped d-flex flex-row align-items-center px-3">
    <Row className="no-gutters py-3 flex-grow">
      <Col xs="2" className="d-flex flex-column justify-content-center">
        <ImageRound path={image} />
      </Col>
      <Col xs="8" className="px-2">
        <A className="link-discreet" click={() => viewPlayer(id)}>
          <h4 className="mb-2 font-weight-normal text-truncate">
            {name}
          </h4>
        </A>
        {showAverages
          ? <PlayerAverages averages={averages} />
          : <UpcomingGames upcomingGames={upcomingGames} team={team} />
        }
      </Col>
      <Col xs="2" className="d-flex flex-column justify-content-center text-center">
        <h1 className="faded-1 m-0">
          {Math.round(score)}
        </h1>
        <p className="faded-2 m-0">AVG</p>
      </Col>
    </Row>
    <PlayerRosterButton 
      id={id}
      availableAction={availableAction}
      addPlayer={addPlayer}
      removePlayer={removePlayer}
    />
  </div>
);

export default Player;