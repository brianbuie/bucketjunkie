import React from 'react';
import { connect } from 'react-redux';
import Draft from './Draft';

const mapStateToProps = (state) => ({
  draft: state.rosters[0],
});

export default connect(
  mapStateToProps,
)(Draft);