import React from 'react';

export const BouncingBallLoader = () => (
  <div className="BallLoader__Position">
    <div className="BallLoader__Bounce">
      <div className="BallLoader__Spin--eased">
        <div className="BallLoader__Ball"></div>
      </div>
    </div>
    <div className="BallLoader__Bounce__Shadow"></div>
  </div>
);

export const SpinningBallLoader = () => (
  <div className="BallLoader__Position">
    <div className="BallLoader__Spin--constant">
      <div className="BallLoader__Ball"></div>
    </div>
  </div>
);