import React from 'react';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import LeagueCard from 'components/League/LeagueCard';
import { A } from 'components/Utilities';
import { setLeague } from 'actions';

const MyLeagues = ({ myLeagues, setLeague }) => (
  <Scrollbars autoHide>
    <div className="bg-light p-3">
      <h2 className="text-center mb-3">My Leagues</h2>
      {myLeagues.map(league => (
        <A click={() => setLeague(league.id)} key={league.id} className="link-discreet">
          <LeagueCard {...league} />
        </A>
      ))}
    </div>
  </Scrollbars>
);

const mapStateToProps = ({ myLeagues }) => ({ myLeagues });

const mapDispatchToProps = dispatch => ({
  setLeague: id => dispatch(setLeague(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyLeagues);