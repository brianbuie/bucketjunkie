import React from 'react';
import { connect } from 'react-redux';
import Draft from '../Draft';
import Rosters from '../Rosters/RostersContainer';

const DashHome = ({ league }) => {
  if (league.drafting) return(<Draft />);
  return (<Rosters />);
}

const mapStateToProps = (state) => ({
  league: state.league,
});

export default connect(
  mapStateToProps,
)(DashHome);