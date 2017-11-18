import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import TeamIcon from '../../components/Team/TeamIcon';
import PlayerList from '../../components/Player/PlayerList';
import './AllPlayers.scss';

const AllPlayers = ({ teams, players, match }) => {
  console.log(match);
  return (
  <div className="bg-light">
    <div className="TeamFilters">
      <Link to={`/dash/teams/`} className={`TeamFilter ${!match.params.team ? 'active' : ''}`}>
        <TeamIcon id='nba' />
      </Link>
      {teams.map(team => (
        <Link 
          to={`/dash/teams/${team._id}`}
          className={`TeamFilter ${match.params.team == team._id ? 'active' : ''}`} 
          key={team._id}
        >
          <TeamIcon id={team._id} />
        </Link>
      ))}
    </div>
    <PlayerList filter={
      match.params.team
      ? { type: "TEAM", team: match.params.team }
      : { type: "SHOW_ALL" }
    } />
  </div>
);
}

const mapStateToProps = (state) => ({
  teams: state.teams,
});

export default withRouter(connect(
  mapStateToProps
)(AllPlayers));