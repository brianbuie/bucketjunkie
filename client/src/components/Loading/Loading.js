import React from 'react';
import { connect } from 'react-redux';
import './Loading.scss';

const Loading = ({ loading }) => (
  loading ? <div className="Loading__Container"></div> : ''
);

const mapStateToProps = state => ({
  loading: state.loading
});

export default connect(
  mapStateToProps
)(Loading);