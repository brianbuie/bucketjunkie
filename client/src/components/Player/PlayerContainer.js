import { connect } from 'react-redux';
import Player from 'components/Player/Player';
import { addPlayer, removePlayer } from 'actions';

const getAvailableAction = (state, id) => {
  let roster = state.rosters.filter(roster => roster.players.some(p => p._id == id))[0];
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
  removePlayer: id => dispatch(removePlayer(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Player);