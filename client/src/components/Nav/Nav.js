import './Nav.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Scrollbars } from 'react-custom-scrollbars';
import { Nav as BootstrapNav, NavItem } from 'reactstrap';
import TeamIcon from 'components/Team/TeamIcon';
import Collapse from 'components/Utilities/Collapse';
import { A } from 'components/Utilities';
import routes from 'routes';

const Nav = ({ teams, loc, league }) => (
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
            Rosters
          </Link>
        </NavItem>}
        <NavItem active={loc.pathname === routes.publicLeagues}>
          <Link to={routes.publicLeagues}>
            <i className="fa fa-server" />
            Leagues
          </Link>
        </NavItem>
        <Collapse toggler={({ onClick, isOpen }) => (
          <NavItem>
            <A click={onClick}>
              <i className="fa fa-user-plus" />
              Players
              <i className={`nav-caret fa fa-${isOpen ? 'caret-down' : 'caret-left'}`} />
            </A>
          </NavItem>
        )}>
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
        </Collapse>
      </BootstrapNav>
    </Scrollbars>
  </div>
);

const mapStateToProps = ({ teams, router, league }) => ({ teams, league, loc: router.location });

export default withRouter(connect(
  mapStateToProps
)(Nav));