import React from 'react';
import { connect } from 'react-redux';
import { movePlayer } from 'actions';
import { A } from 'components/Utilities';
import { Panel } from 'components/UI';
import { PageHeading } from 'components/UI';
import PlayerContainer from 'components/Player/PlayerContainer';
import PlayerListItem from 'components/Player/PlayerListItem';
import Countdown from 'components/League/Countdown';

const Draft = ({ draft, movePlayer, league }) => (
  <div>
    <div className="mb-3 pb-3 border-bottom">
      <span className="faded-2">{league.name}</span>
      <Countdown end={league.start} />
    </div>
    <h4 className="text-center mb-3 faded-2">My Draft List</h4>
    {(draft && draft.players && draft.players.length) ? (
      <Panel>
        {draft.players.map(player => (
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
        ))}
      </Panel>
    ) : (
      <p className="faded-2 text-center p-3">
        Get started by adding players to your draft list. The league will autodraft when the timer runs out.
      </p>
    )}
  </div>
);

export default connect(
  ({ rosters, user, league }) => ({
    draft: rosters.filter(roster => roster.user._id === user._id)[0] || [],
    league
  }),
  dispatch => ({
    movePlayer: (player, delta) => dispatch(movePlayer(player, delta))
  })
)(Draft);