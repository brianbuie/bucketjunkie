import React from 'react';
import { connect } from 'react-redux';
import { A } from '../Utilities';
import TeamIcon from './TeamIcon';
import './TeamFilter.scss';

const TeamFilters = ({ filterClick, teams, activeTeam }) => {
  return (
    <div className="TeamFilters">
      <A 
        click={filterClick} 
        active={!activeTeam} 
        className="TeamFilter"
      >
        <TeamIcon id='nba' />
      </A>
      {teams.map(team => (
        <A 
          click={() => filterClick(team._id)} 
          active={team._id === activeTeam}
          className="TeamFilter"
          key={team._id}
        >
          <TeamIcon id={team._id} />
        </A>
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  teams: state.teams
});

export default connect(
  mapStateToProps
)(TeamFilters);