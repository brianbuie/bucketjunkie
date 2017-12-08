import React from 'react';
import { connect } from 'react-redux';
import { addPlayer, removePlayer, viewPlayer } from 'actions';

const PlayerContainer = props => {
  let Component = props.component;
  return <Component {...props} />
}

const getAvailableAction = (state, id) => {
  let roster = state.rosters.filter(roster => roster.players.some(p => p._id == id))[0];
  if (!state.league) return 'NONE';
  if (!roster) return 'ADD';
  if (roster.user._id == state.user._id) return 'REMOVE';
  return 'NONE';
};

const mapStateToProps = (state, ownProps) => ({
  ...state.players.filter(player => player._id == ownProps.id)[0],
  availableAction: getAvailableAction(state, ownProps.id)
});

const mapDispatchToProps = dispatch => ({
  addPlayer: id => dispatch(addPlayer(id)),
  removePlayer: id => dispatch(removePlayer(id)),
  viewPlayer: id => dispatch(viewPlayer(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerContainer);