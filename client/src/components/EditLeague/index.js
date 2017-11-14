import React from 'react';
import { connect } from 'react-redux';
import EditLeague from './EditLeague';

const mapStateToProps = (state) => ({ 
  ...state.league,
});

export default connect(
  mapStateToProps,
)(EditLeague);