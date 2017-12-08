import React from 'react';
import { Row, Col } from 'reactstrap';
import routes from 'routes';
import { A } from 'components/Utilities';
import TeamIcon from 'components/Team/TeamIcon';
import UpcomingGames from 'components/Player/UpcomingGames';
import PlayerAverages from 'components/Player/PlayerAverages';

const PlayerImage = ({ image }) => {
  return (
    <div className="rounded-circle player__picture"
      style={{backgroundImage: `url("${image}")`}}
    >
    </div>
  );
};

const PlayerButton = ({ id, availableAction, addPlayer, removePlayer }) => {
  switch (availableAction) {
    case 'ADD':
      return (
        <A click={() => addPlayer(id)}>
          <i className="fa fa-plus-circle text-success"></i>
        </A>
      );
    case 'REMOVE':
      return (
        <A click={() => removePlayer(id)}>
          <i className="fa fa-minus-circle text-danger"></i>
        </A>
      );
    default:
      return <i className="fa fa-circle-o invisible"></i>
  }
};

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
        <PlayerImage image={image} />
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
    <PlayerButton 
      id={id}
      availableAction={availableAction}
      addPlayer={addPlayer}
      removePlayer={removePlayer}
    />
  </div>
);

export default Player;