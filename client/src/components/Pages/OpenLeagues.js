import React from 'react';
import { Link } from 'react-router-dom';
import LeagueCard from 'components/League/LeagueCard';
import { get } from 'actions';
import { Panel, PageHeading } from 'components/UI';
import AsyncContainer from 'components/Fetch/AsyncContainer';
import CenteredLayout from 'components/Layout/CenteredLayout';

const OpenLeagues = props => (
  <CenteredLayout>
    <PageHeading eyebrow="Public" headline="Leagues" />
    <AsyncContainer
      {...props}
      asyncAction={() => get('/api/leagues/public')} 
      Component={({ leagues }) => (
        leagues.length ? leagues.map(league => (
          <Link key={league.id} to={`/league/${league.id}`}>
            <Panel key={league.id}>
              <div className="px-3 py-2">
                <LeagueCard {...league} />
              </div>
            </Panel>
          </Link>
        )) : <p className="faded-2 text-center py-4">No open leagues. You should create one...</p> 
      )}
      LoadingComponent={() => 'Loading'}
    />
    <div className="text-center">
      <Link to="/leagues/create" className="btn btn-outline-primary btn-block">
        Create League
      </Link>
    </div>
  </CenteredLayout>
);

export default OpenLeagues;