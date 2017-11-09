import React from 'react';
import { connect } from 'react-redux';
import Content from './Content';

const mapStateToProps = (state) => ({ 
  league: state.league,
  page: state.page
});

const ContentContainer = connect(
  mapStateToProps,
)(Content);

export default ContentContainer;