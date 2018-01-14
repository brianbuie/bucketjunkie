import React from 'react';
import { connect } from 'react-redux';
import LeagueCard from 'components/League/LeagueCard';
import { A, FullHeight } from 'components/Utilities';
import { setLeague, getMyLeagues } from 'actions';
import LocalFetch from 'components/FetchManager/LocalFetch';

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

const mapStateToProps = ({ myLeagues }) => ({ myLeagues });

const mapDispatchToProps = dispatch => ({
  setLeague: id => dispatch(setLeague(id)),
  getMyLeagues: () => dispatch(getMyLeagues())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyLeagues);