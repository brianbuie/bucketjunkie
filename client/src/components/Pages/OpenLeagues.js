import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LeagueCard from 'components/League/LeagueCard';
import { Panel, PageHeading } from 'components/UI';
import FetchContainer from 'components/FetchManager/FetchContainer';
import CenteredLayout from 'components/Layout/CenteredLayout';

const OpenLeagues = ({ createLeague, user }) => (
  <CenteredLayout>
    <PageHeading eyebrow="Public" headline="Leagues" />
    <FetchContainer url='/api/leagues/public' user={user} component={({ leagues }) => (
      leagues.length ? leagues.map(league => (
        <Link key={league.id} to={`/league/${league.id}`}>
          <Panel key={league.id}>
            <div className="px-3 py-2">
              <LeagueCard {...league} />
            </div>
          </Panel>
        </Link>
      )) : <p className="faded-2 text-center py-4">No open leagues. You should create one...</p> 
    )} />
    <div className="text-center">
      <Link to="/leagues/create" className="btn btn-outline-primary btn-block">
        Create League
      </Link>
    </div>
  </CenteredLayout>
);

export default connect(
  ({ user }) => ({ user })
)(OpenLeagues);