import React from 'react';
import { Row, Col } from 'reactstrap';
import TeamIcon from '../Team/TeamIcon';
import PlayerButton from './PlayerButton';
import moment from 'moment';

const PlayerImage = ({ path }) => {
  return (
    <div className="rounded-circle player__picture"
      style={{backgroundImage: `url("${path}")`}}
    >
    </div>
  );
};

const Player = ({ player }) => {
  const upcomingDays = player.upcomingGames.map((g, i) => moment().add(i, 'days'));
  return (
    <div className="striped d-flex flex-row align-items-center px-3">
      <Row className="no-gutters py-3 flex-grow">
        <Col xs="2" className="d-flex flex-column justify-content-center">
          <PlayerImage path={player.image} />
        </Col>
        <Col xs="8" className="px-2">
          <h4 className="mb-2 font-weight-normal text-truncate">
            {player.name}
          </h4>
          <table style={{width: '100%'}}>
            <tbody>
              <tr>
                {upcomingDays.map((day, key) => (
                  <td className="one-seventh faded-2 text-center text-sm" key={key}>
                    {day.format('ddd').toUpperCase()}
                  </td>
                ))}
              </tr>
              <tr>
                {player.upcomingGames.map((game, key) => (
                  <td className="one-seventh text-center text-sm" key={key}>
                    {game
                      ? game.home === player.team 
                        ? <TeamIcon id={game.away} />
                        : <TeamIcon id={game.home} />
                      : ''
                    }
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Col>
        <Col xs="2" className="d-flex flex-column justify-content-center text-center">
          <h1 className="faded-1 m-0">
            {Math.round(player.score)}
          </h1>
          <p className="faded-2 m-0">AVG</p>
        </Col>
      </Row>
      <PlayerButton player={player} />
    </div>
  );
}

export default Player;