import React from 'react';
import { connect } from 'react-redux';
import './loadingStyle.scss';

const PageBlockingLoader = ({ globalLoading }) => (
  globalLoading ? <div className="PageBlockingLoader"></div> : ''
);

export default connect(
  ({ globalLoading }) => ({ globalLoading })
)(PageBlockingLoader);