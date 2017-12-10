import React from 'react';
import PlayerList from 'components/Player/PlayerList';
import UserPhoto from 'components/User/UserPhoto';

const Roster = ({ user, score, players }) => (
  <div className="mb-3">
    <div className="d-flex flex-row align-items-center py-2 px-3">
      <div style={{ width: "20%" }}>
        <UserPhoto photo={user.photo} />
      </div>
      <h3 className="px-3 flex-grow font-weight-normal"> {user.username} </h3>
      <h2> {score} </h2>
    </div>
    <PlayerList filter={{ type: 'SORTED_LIST', list: players }} />
  </div>
);

export default Roster;