import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { joinLeague, changeDetailView } from 'actions';
import LeagueCard from 'components/League/LeagueCard';
import { A } from 'components/Utilities';
import { Panel } from 'components/UI';
import PageHeading from 'components/UI/PageHeading';
import FetchContainer from 'components/FetchManager/FetchContainer';

const OpenLeagues = ({ leagues, joinLeague, createLeague }) => (
  <div>
    <PageHeading eyebrow="Public" headline="Leagues" />
    {leagues.length ? leagues.map(league => (
      <Panel key={league.id}>
        <div className="flex-row px-3 py-2">
          <LeagueCard {...league} />
          <A click={() => joinLeague(league.id)} className="flex-column p-2 justify-content-center">
            <i className="fa fa-plus-circle text-success"></i>
          </A>
        </div>
      </Panel>
    )) : <p className="faded-2 text-center py-4">No open leagues. You should create one...</p> }
    <div className="text-center">
      <Button color="success" onClick={createLeague}>
        Create League
      </Button>
    </div>
  </div>
);

const OpenLeaguesContainer = props => (
  <FetchContainer url='/api/leagues/public' component={OpenLeagues} {...props} />
);

const mapDispatchToProps = dispatch => ({
  joinLeague: id => dispatch(joinLeague(id)),
  createLeague: () => dispatch(changeDetailView({ view: 'CREATE_LEAGUE' }))
});

export default connect(
  null,
  mapDispatchToProps
)(OpenLeaguesContainer);