import React from 'react';
import PlayerContainer from 'components/Player/PlayerContainer';
import Player from 'components/Player/Player';

const PlayerDetail = ({ id }) => (
  <div className="bg-light">
    <PlayerContainer id={id} showAverages component={Player} />
  </div>
);

export default PlayerDetail;