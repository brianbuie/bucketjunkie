import React from 'react';
import PlayerContainer from '../Player/PlayerContainer';

const Draft = ({ draft }) => (
  <div className="bg-light mb-3">
    {draft.players.map(player => (
      <PlayerContainer id={player._id} key={player._id} />
    ))}
  </div>
);

export default Draft;