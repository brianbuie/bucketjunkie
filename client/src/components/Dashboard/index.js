import React from 'react';
import { connect } from 'react-redux';
import Dashboard from './Dashboard';

const mapStateToProps = (state) => ({ 
  league: state.league,
});

export default connect(
  mapStateToProps,
)(Dashboard);