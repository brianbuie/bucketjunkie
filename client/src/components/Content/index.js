import React from 'react';
import { connect } from 'react-redux';
import Content from './Content';

const mapStateToProps = (state) => ({ 
  league: state.league,
  user: state.user,
});

export default connect(
  mapStateToProps,
)(Content);