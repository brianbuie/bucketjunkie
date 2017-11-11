import React from 'react';
import { connect } from 'react-redux';
import LeagueInfo from './LeagueInfo';

const mapStateToProps = (state) => ({ 
  league: state.league,
  user: state.user,
});

const LeagueInfoContainer = connect(
  mapStateToProps,
)(LeagueInfo);

export default LeagueInfoContainer;