import React from 'react';
import { connect } from 'react-redux';
import { movePlayer } from '../../actions';
import Draft from './Draft';

const mapStateToProps = (state) => ({
  draft: state.rosters[0],
});

const mapDispatchToProps = dispatch => ({
  movePlayer: (player, delta) => dispatch(movePlayer(player, delta))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Draft);