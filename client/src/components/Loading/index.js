import React from 'react';
import { connect } from 'react-redux';
import Loading from './Loading';

const mapStateToProps = state => ({
  loading: state.loading
});

export default connect(
  mapStateToProps
)(Loading);