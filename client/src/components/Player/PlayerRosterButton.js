import React from 'react';
import { A } from 'components/Utilities';

const PlayerRosterButton = ({ id, availableAction, addPlayer, removePlayer }) => {
  switch (availableAction) {
    case 'ADD':
      return (
        <A click={() => addPlayer(id)}>
          <i className="fa fa-plus-circle text-success"></i>
        </A>
      );
    case 'REMOVE':
      return (
        <A click={() => removePlayer(id)}>
          <i className="fa fa-minus-circle text-danger"></i>
        </A>
      );
    default:
      return <i className="fa fa-plus-circle faded-3"></i>
  }
};

export default PlayerRosterButton;