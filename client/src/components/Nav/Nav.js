import React from 'react';
import { Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { Nav as BootstrapNav, NavItem } from 'reactstrap';
import TeamIcon from 'components/Team/TeamIcon';
import Collapse from 'components/Utilities/Collapse';
import A from 'components/Utilities/A';
import routes from 'routes';

const Nav = ({ teams, loc, league, user }) => (
  <div className="height-100 text-center" style={{ width: "200px" }}>
    <Scrollbars autoHide>
      <BootstrapNav vertical>
        <li className="brand">
          <Link to="/">
            <img src="/images/logo-beta.svg" alt="BucketJunkie" />
          </Link>
        </li>
        {league && <NavItem active={loc.pathname === routes.rosters}>
          <Link to={routes.rosters}>
            <i className="fa fa-user-circle" />
            {league.started ? 'Rosters' : 'My Draft List'}
          </Link>
        </NavItem>}
        {!user && <NavItem active={loc.pathname === routes.login}>
          <Link to={routes.login}>
            <i className="fa fa-user-circle" />
            Login
          </Link>
        </NavItem>}
        <NavItem active={loc.pathname === routes.publicLeagues}>
          <Link to={routes.publicLeagues}>
            <i className="fa fa-server" />
            Leagues
          </Link>
        </NavItem>
        <NavItem active={loc.pathname === routes.teams}>
          <Link to={routes.teams}>
            <i className="fa fa-user-plus" />
            Top Players
          </Link>
        </NavItem>
        <Collapse Toggler={({ onClick, isOpen }) => (
          <NavItem>
            <A click={onClick}>
              <TeamIcon id='nba' />
              Teams
              <i className={`nav-caret fa fa-${isOpen ? 'caret-down' : 'caret-left'}`} />
            </A>
          </NavItem>
        )}>
          {teams
            .sort((a,b) => a.name < b.name ? -1 : 1)
            .map(team => (
            <NavItem active={loc.pathname === routes.teams + '/' + team._id} key={team._id}>
              <Link to={`${routes.teams}/${team._id}`}>
                <TeamIcon id={team._id} />
                {team.name}
              </Link>
            </NavItem>
          ))}
        </Collapse>
      </BootstrapNav>
    </Scrollbars>
  </div>
);

export default Nav;