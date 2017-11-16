import React from 'react';
import { A } from '../Utilities';
import PlayerContainer from '../Player/PlayerContainer';

const Draft = ({ draft, movePlayer }) => (
  <div className="bg-light mb-3">
    {draft.players.map(player => (
      <div className="d-flex flex-row align-items-center justify-content-between striped" key={player._id}>
        <div className="d-flex flex-column px-1">
          <A className="link-discreet" click={() => movePlayer(player._id, -1)}>
            <i className="fa fa-arrow-up" />
          </A>
          <A className="link-discreet" click={() => movePlayer(player._id, 1)}>
            <i className="fa fa-arrow-down" />
          </A>
        </div>
        <PlayerContainer id={player._id} />
      </div>
    ))}
  </div>
);

export default Draft;