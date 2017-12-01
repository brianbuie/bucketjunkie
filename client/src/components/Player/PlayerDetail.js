import React from 'react';
import PlayerContainer from 'components/Player/PlayerContainer';

const PlayerDetail = ({ match }) => (
  <div className="bg-light">
    <PlayerContainer id={match.params.id} showAverages />
  </div>
);

export default PlayerDetail;