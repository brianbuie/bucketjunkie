import React from 'react';
import { connect } from 'react-redux';
import Content from './Content';

const mapStateToProps = (state) => ({ 
  league: state.league,
  user: state.user,
});

const ContentContainer = connect(
  mapStateToProps,
)(Content);

export default ContentContainer;