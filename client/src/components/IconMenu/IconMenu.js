import './IconMenu.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import TeamIcon from 'components/Team/TeamIcon';
import routes from 'routes';

const IconMenu = ({ teams, match }) => (
  <div className="d-flex flex-column max-height-100 bg-light">
    <Link to={routes.teams} className={`IconMenu__Item ${!match.params.team ? 'active' : ''}`}>
      <TeamIcon id='nba' />
    </Link>
    {teams.map(team => (
      <Link 
        to={`${routes.teams}/${team._id}`}
        className={`IconMenu__Item ${match.params.team == team._id ? 'active' : ''}`} 
        key={team._id}
      >
        <TeamIcon id={team._id} />
      </Link>
    ))}
  </div>
);

const mapStateToProps = ({ teams }) => ({ teams });

export default withRouter(connect(
  mapStateToProps
)(IconMenu));