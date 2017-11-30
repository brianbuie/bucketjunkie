import React from 'react';
import PlayerContainer from 'components/Player/PlayerContainer';

const PlayerPage = ({ match }) => (
  <div className="bg-light">
    <PlayerContainer id={match.params.id} showAverages />
  </div>
);

export default PlayerPage;