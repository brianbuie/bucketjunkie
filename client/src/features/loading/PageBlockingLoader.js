import React from 'react';
import { connect } from 'react-redux';
import './loadingStyle.scss';
import { BouncingBallLoader } from 'features/loading/BallLoaders';

const PageBlockingLoader = ({ globalLoading }) => globalLoading ? (
  <div className="PageBlockingLoader">
    <BouncingBallLoader />
  </div>
) : '';

export default connect(
  ({ globalLoading }) => ({ globalLoading })
)(PageBlockingLoader);