import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'components/UI';
import { Scrollbars } from 'react-custom-scrollbars';
import Draft from 'components/Rosters/Draft';
import Rosters from 'components/Rosters/Rosters';
import PlayerDetailLayout from 'components/Layout/PlayerDetailLayout';

const LeagueStandings = ({ league }) => league ? (
  <PlayerDetailLayout>
    <Scrollbars autoHide>
      <Container size="4" className="width-100 height-100 MenuButtonBreather">
        {!league.started && league.uniqueRosters
          ? <Draft />
          : <Rosters />
        }
      </Container>
    </Scrollbars>
  </PlayerDetailLayout>
) : '';

export default connect(
  ({ league }) => ({ league })
)(LeagueStandings);