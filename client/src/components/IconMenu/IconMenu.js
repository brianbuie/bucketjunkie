import './IconMenu.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import TeamIcon from 'components/Team/TeamIcon';
import routes from 'routes';

const IconMenu = ({ teams, loc }) => (
  <div className="d-flex flex-column bg-light">
    <Link to={routes.rosters} className={`IconMenu__Item ${loc.pathname === routes.rosters ? 'active' : ''}`}>
      <i className="fa fa-user-circle" />
    </Link>
    <Link to={routes.teams} className={`IconMenu__Item ${loc.pathname === routes.teams ? 'active' : ''}`}>
      <TeamIcon id='nba' />
    </Link>
    {teams.map(team => (
      <Link 
        to={`${routes.teams}/${team._id}`}
        className={`IconMenu__Item ${loc.pathname === routes.teams + '/' + team._id ? 'active' : ''}`}
        key={team._id}
      >
        <TeamIcon id={team._id} />
      </Link>
    ))}
  </div>
);

const mapStateToProps = ({ teams, router }) => ({ teams, loc: router.location });

export default withRouter(connect(
  mapStateToProps
)(IconMenu));