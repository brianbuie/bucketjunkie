import React from 'react';
import moment from 'moment';
import { Row, Col } from 'reactstrap';
import { A } from '../Utilities';
import TeamIcon from '../Team/TeamIcon';

const PlayerImage = ({ path }) => {
  return (
    <div className="rounded-circle player__picture"
      style={{backgroundImage: `url("${path}")`}}
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

const Player = props => {
  const upcomingDays = props.upcomingGames.map((g, i) => moment().add(i, 'days'));
  return (
    <div className="striped d-flex flex-row align-items-center px-3">
      <Row className="no-gutters py-3 flex-grow">
        <Col xs="2" className="d-flex flex-column justify-content-center">
          <PlayerImage path={props.image} />
        </Col>
        <Col xs="8" className="px-2">
          <h4 className="mb-2 font-weight-normal text-truncate">
            {props.name}
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
                {props.upcomingGames.map((game, key) => (
                  <td className="one-seventh text-center text-sm" key={key}>
                    {game
                      ? game.home === props.team 
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
            {Math.round(props.score)}
          </h1>
          <p className="faded-2 m-0">AVG</p>
        </Col>
      </Row>
      <PlayerButton {...props} />
    </div>
  );
}

export default Player;