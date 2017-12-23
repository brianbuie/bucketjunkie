import React from 'react';
import { connect } from 'react-redux';

const TeamContainer = props => (
  <props.component {...props} />
);

const mapStateToProps = (state, ownProps) => ({
  ...state.teams.filter(team => team._id == ownProps.id)[0],
});

export default connect(
  mapStateToProps
)(TeamContainer);