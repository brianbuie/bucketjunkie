import React from 'react';
import { connect } from 'react-redux';
import { postActivityItem } from '../../actions';

const PlayerButton = ({ player, user, rosters, dispatch }) => {

  const addPlayer = e => {
    e.preventDefault();
    dispatch(postActivityItem({ player: player._id }, '/roster/add-player'));
  };
  const addButton = () => (
    <a className="success" href="" onClick={addPlayer}>
      <i className="fa fa-plus-circle text-success"></i>
    </a>
  );

  const removePlayer = e => {
    e.preventDefault();
    dispatch(postActivityItem({ player: player._id }, '/roster/remove-player'));
  };
  const removeButton = () => (
    <a className="danger" href="" onClick={removePlayer}>
      <i className="fa fa-minus-circle text-danger"></i>
    </a>
  );

  const noButton = () => (
    <i className="fa fa-circle-o invisible"></i>
  );

  const determineButton = () => {
    let roster = rosters.filter(roster => roster.players.some(p => p._id === player._id))[0];
    if (!roster) return addButton();
    if (roster.user._id === user._id) return removeButton();
    return noButton();
  };

  return (
    <div className="align-middle text-lg px-2">
      {determineButton()}
    </div>
  );
}

export default connect(
  (state) => ({ user: state.user, rosters: state.rosters }),
)(PlayerButton);