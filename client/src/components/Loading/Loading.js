import React from 'react';
import './Loading.scss';

const Loading = ({ loading }) => (
  loading ? <div className="Loading__Container"></div> : ''
);

export default Loading;