import React from 'react';
import { connect } from 'react-redux';
import { movePlayer } from 'actions';
import { A } from 'components/Utilities';
import { Panel } from 'components/UI';
import PlayerContainer from 'components/Player/PlayerContainer';
import PlayerListItem from 'components/Player/PlayerListItem';

const Draft = ({ draft, movePlayer }) => (
  <Panel>
    {draft.players ? draft.players.map(player => (
      <div className="flex-row align-items-center pl-2" key={player._id}>
        <div className="flex-column px-1">
          <A click={() => movePlayer(player._id, -1)}>
            <i className="fa fa-arrow-up" />
          </A>
          <A click={() => movePlayer(player._id, 1)}>
            <i className="fa fa-arrow-down" />
          </A>
        </div>
        <div className="flex-grow">
          <PlayerContainer id={player._id} component={PlayerListItem} />
        </div>
      </div>
    )) : ''}
  </Panel>
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