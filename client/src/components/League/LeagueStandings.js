import React from 'react';
import { connect } from 'react-redux';
import Draft from 'components/Rosters/Draft';
import Rosters from 'components/Rosters/Rosters';

const LeagueStandings = ({ league }) => {
  if (!league) return '';
  if (league.drafting) return(<Draft />);
  return (<Rosters />);
}

const mapStateToProps = ({ league }) => ({ league });

export default connect(
  mapStateToProps,
)(LeagueStandings);