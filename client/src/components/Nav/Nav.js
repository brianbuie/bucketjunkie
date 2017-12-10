import './Nav.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Nav as BootstrapNav, NavItem } from 'reactstrap';
import TeamIcon from 'components/Team/TeamIcon';
import routes from 'routes';
import Logo from 'components/Nav/Logo';

const Nav = ({ teams, loc }) => (
  <BootstrapNav vertical>
    <li className="brand">
      <Logo />
    </li>
    <NavItem active={loc.pathname === routes.rosters}>
      <Link to={routes.rosters}>
        <i className="fa fa-user-circle" />
        Rosters
      </Link>
    </NavItem>
    <NavItem active={loc.pathname === routes.publicLeagues}>
      <Link to={routes.publicLeagues}>
        <i className="fa fa-server" />
        Leagues
      </Link>
    </NavItem>
    <NavItem active={loc.pathname === routes.teams}>
      <Link to={routes.teams}>
        <TeamIcon id='nba' />
        Top Players
      </Link>
    </NavItem>
    {teams.map(team => (
      <NavItem active={loc.pathname === routes.teams + '/' + team._id} key={team._id}>
        <Link to={`${routes.teams}/${team._id}`}>
          <TeamIcon id={team._id} />
          {team.abbreviation}
        </Link>
      </NavItem>
    ))}
  </BootstrapNav>
);

const mapStateToProps = ({ teams, router }) => ({ teams, loc: router.location });

export default withRouter(connect(
  mapStateToProps
)(Nav));