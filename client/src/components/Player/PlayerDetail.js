import React from 'react';
import PlayerContainer from 'components/Player/PlayerContainer';

const PlayerDetail = ({ id }) => (
  <div className="bg-light">
    <PlayerContainer id={id} showAverages />
  </div>
);

export default PlayerDetail;