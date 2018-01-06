import React from 'react';
import { connect } from 'react-redux';
import Draft from 'components/Rosters/Draft';
import Rosters from 'components/Rosters/Rosters';
import PlayerDetailLayout from 'components/Layout/PlayerDetailLayout';

const LeagueStandings = ({ league }) => league ? (
  <PlayerDetailLayout>
    {!league.started && league.uniqueRosters
      ? <Draft />
      : <Rosters />
    }
  </PlayerDetailLayout>
) : '';

export default connect(
  ({ league }) => ({ league })
)(LeagueStandings);