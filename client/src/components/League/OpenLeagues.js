import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { changeDetailView } from 'actions';
import LeagueCard from 'components/League/LeagueCard';
import { A } from 'components/Utilities';
import { Panel, PageHeading } from 'components/UI';
import FetchContainer from 'components/FetchManager/FetchContainer';

const OpenLeagues = ({ createLeague, user }) => (
  <div>
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
      <Button color="success" onClick={createLeague}>
        Create League
      </Button>
    </div>
  </div>
);

export default connect(
  ({ user }) => ({ 
    user 
  }),
  dispatch => ({
    createLeague: () => dispatch(changeDetailView({ view: 'CREATE_LEAGUE' }))
  })
)(OpenLeagues);