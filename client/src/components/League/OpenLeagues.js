import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { joinLeague, changeDetailView } from 'actions';
import LeagueCard from 'components/League/LeagueCard';
import { A, FullHeight } from 'components/Utilities';
import FetchContainer from 'components/FetchManager/FetchContainer';

const OpenLeagues = ({ leagues, joinLeague, createLeague }) => (
  <FullHeight>
    <div className="bg-light p-3">
      <h2 className="text-center mb-3">Open Leagues</h2>
      {leagues.length ? leagues.map(league => (
        <div className="flex-row" key={league.id}>
          <LeagueCard {...league} />
          <A click={() => joinLeague(league.id)} className="flex-column p-2 justify-content-center">
            <i className="fa fa-plus-circle text-success"></i>
          </A>
        </div>
      )) : <p className="faded-2 text-center">No open leagues. You should create one...</p> }
      <div className="text-center">
        <Button color="success" onClick={createLeague}>
          Create League
        </Button>
      </div>
    </div>
  </FullHeight>
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