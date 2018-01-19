import React from 'react';
import { connect } from 'react-redux';

const MemberContainer = props => {
  const { Component, ...newProps } = props;
  return <Component {...newProps} />
};

export default connect(
  ({ league }, ownProps) => league ? { ...league.members.filter(member => member._id == ownProps.id)[0] } : {}
)(MemberContainer);