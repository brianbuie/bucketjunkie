import React from 'react';
import { connect } from 'react-redux';

const MemberContainer = props => {
  const { Component, fallback, ...newProps } = props;
  return <Component {...newProps} />
};

export default connect(
  ({ league }, ownProps) => {
    const user = (league && league.members.find(member => member._id == ownProps.id)) || ownProps.fallback;
    return ({ ...user });
  }
)(MemberContainer);