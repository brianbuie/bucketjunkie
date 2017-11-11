import React from 'react';
import { connect } from 'react-redux';
import { postActivityItem } from '../../actions';

const PlayerButtons = ({ player, user, dispatch }) => (
  <div className="align-middle text-lg px-2">
    {player.takenBy 
      ? player.takenBy._id === user._id
        ? <a className="danger" href="" onClick={e => {
            e.preventDefault();
            dispatch(postActivityItem({ player: player._id }, '/roster/remove-player'));
          }}>
            <i className="fa fa-minus-circle text-danger"></i>
          </a>
        : ''
      : <a className="success" href="" onClick={e => {
          e.preventDefault();
          dispatch(postActivityItem({ player: player._id }, '/roster/add-player'));
        }}>
          <i className="fa fa-plus-circle text-success"></i>
        </a>
    }
  </div>
);

export default connect(
  (state) => ({ user: state.user }),
)(PlayerButtons);