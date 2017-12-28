import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import TeamIcon from 'components/Team/TeamIcon';
import routes from 'routes';

const UpcomingGames = ({ upcomingGames, team }) => {
  const upcomingDays = upcomingGames.map((g, i) => moment().add(i, 'days'));
  return (
    <div className="px-3">
      <table style={{width: '100%'}}>
        <tbody>
          <tr className="pb-2">
            {upcomingDays.map((day, key) => (
              <td className="one-seventh faded-2 text-center" key={key}>
                <small>
                  {day.format('ddd').toUpperCase()}
                </small>
              </td>
            ))}
          </tr>
          <tr>
            {upcomingGames.map((game, key) => {
              let opponent = game 
                ? game.home === team 
                  ? game.away
                  : game.home
                : null;
              return (
                <td className="one-seventh text-center text-sm" key={key}>
                  {opponent ?
                    <Link to={`${routes.teams}/${opponent}`}>
                      <TeamIcon id={opponent} style={{ maxWidth: '40px' }}/>
                    </Link>
                  : ''}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default UpcomingGames;