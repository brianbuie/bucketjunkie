import React from 'react';
import PlayerList from 'components/Player/PlayerList';
import UserPhoto from 'components/User/UserPhoto';
import { Panel } from 'components/UI';

const Roster = ({ user, score, players }) => (
  <Panel>
    <div className="d-flex flex-row align-items-center px-3 py-2">
      <div style={{ width: "20%" }}>
        <UserPhoto photo={user.photo} />
      </div>
      <h3 className="px-3 flex-grow font-weight-normal"> {user.username} </h3>
      <h2> {score} </h2>
    </div>
    <PlayerList filter={{ type: 'SORTED_LIST', list: players }} />
  </Panel>
);

export default Roster;