import React from 'react';
import { connect } from 'react-redux';
import LeagueCard from 'components/League/LeagueCard';
import A from 'components/Utilities/A';
import FullHeight from 'components/Utilities/FullHeight';
import { setLeague, getMyLeagues } from 'actions';
import AsyncContainer from 'components/Fetch/AsyncContainer';

const MyLeagues = props => (
  <FullHeight>
    <AsyncContainer {...props} asyncAction={props.getMyLeagues} Component={({ myLeagues, setLeague }) => (
      <div className="p-3">
        <h2 className="text-center mb-3">My Leagues</h2>
        {myLeagues.length ? myLeagues.map(league => (
          <A click={() => setLeague(league.id)} key={league.id} className="link-discreet">
            <LeagueCard {...league} />
          </A>
        )) : (
          <p className="text-center faded-2">Join a League to get started!</p>
        )}
      </div>
    )} />
  </FullHeight>
);

export default connect(
  ({ myLeagues }) => ({ myLeagues }),
  dispatch => ({
    setLeague: id => dispatch(setLeague(id)),
    getMyLeagues: () => dispatch(getMyLeagues())
  })
)(MyLeagues);