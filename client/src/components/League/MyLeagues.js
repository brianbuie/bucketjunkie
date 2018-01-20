import React from 'react';
import { connect } from 'react-redux';
import LeagueCard from 'components/League/LeagueCard';
import A from 'components/Utilities/A';
import FullHeight from 'components/Utilities/FullHeight';
import { setLeague, getMyLeagues } from 'actions';
import LocalFetch from 'components/Fetch/LocalFetch';

const MyLeagues = ({ myLeagues, setLeague, getMyLeagues }) => (
  <FullHeight>
    <LocalFetch fetch={getMyLeagues}>
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
    </LocalFetch>
  </FullHeight>
);

export default connect(
  ({ myLeagues }) => ({ myLeagues }),
  dispatch => ({
    setLeague: id => dispatch(setLeague(id)),
    getMyLeagues: () => dispatch(getMyLeagues())
  })
)(MyLeagues);