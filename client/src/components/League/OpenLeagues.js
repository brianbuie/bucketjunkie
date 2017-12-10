import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { joinLeague } from 'actions';
import LeagueCard from 'components/League/LeagueCard';
import { A, FullHeight, FlexRow, FlexColumn } from 'components/Utilities';
import FetchContainer from 'components/FetchManager/FetchContainer';

const OpenLeagues = ({ leagues, joinLeague }) => (
  <FullHeight>
    <div className="bg-light p-3">
      <h2 className="text-center mb-3">Open Leagues</h2>
      {leagues.map(league => (
        <FlexRow key={league.id}>
          <LeagueCard {...league} />
          <A click={() => joinLeague(league.id)} className="d-flex flex-column p-2 justify-content-center">
            <i className="fa fa-plus-circle text-success"></i>
          </A>
        </FlexRow>
      ))}
    </div>
  </FullHeight>
);

const OpenLeaguesContainer = ({ joinLeague }) => (
  <FetchContainer url='/api/leagues/public' component={OpenLeagues} joinLeague={joinLeague} />
);

const mapDispatchToProps = dispatch => ({
  joinLeague: id => dispatch(joinLeague(id))
});

export default connect(
  null,
  mapDispatchToProps
)(OpenLeaguesContainer);