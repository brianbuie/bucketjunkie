import { connect } from 'react-redux';
import Player from './Player';

const mapStateToProps = (state, ownProps) => {
  const player = state.players.filter(player => player._id === ownProps.id)[0];
  return ({ player });
}

const PlayerContainer = connect(
  mapStateToProps
)(Player);

export default PlayerContainer;