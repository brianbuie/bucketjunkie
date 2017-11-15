import React from 'react';
import PlayerList from '../Player/PlayerList';

const Draft = ({ draft }) => (
  <div className="bg-light mb-3">
    <PlayerList filter={{ type: 'LIST', list: draft.players }} />
  </div>
);

export default Draft;