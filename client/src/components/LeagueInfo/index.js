import React from 'react';
import { connect } from 'react-redux';
import LeagueInfo from './LeagueInfo';

const mapStateToProps = (state) => ({ 
  league: state.league,
  user: state.user,
});

export default connect(
  mapStateToProps,
)(LeagueInfo);