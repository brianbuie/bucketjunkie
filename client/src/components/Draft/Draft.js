import React from 'react';
import { connect } from 'react-redux';
import { movePlayer } from 'actions';
import { A } from 'components/Utilities';
import PlayerContainer from 'components/Player/PlayerContainer';

const Draft = ({ draft, movePlayer }) => (
  <div className="bg-light mb-3">
    {draft.players ? draft.players.map(player => (
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
    )) : ''}
  </div>
);

const mapStateToProps = ({ rosters, user }) => ({
  draft: rosters.filter(roster => roster.user._id === user._id)[0] || []
});

const mapDispatchToProps = dispatch => ({
  movePlayer: (player, delta) => dispatch(movePlayer(player, delta))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Draft);