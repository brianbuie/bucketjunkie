import React from 'react';
import { connect } from 'react-redux';
import TeamIcon from 'components/Team/TeamIcon';
import PageHeading from 'components/UI/PageHeading';

const TeamHeading = ({ id, name, city }) => (
  <PageHeading eyebrow={city || 'NBA'} headline={name || 'Top Players'}>
    <TeamIcon id={id || 'nba'} />
  </PageHeading>
);

const mapStateToProps = (state, ownProps) => ({
  ...state.teams.filter(team => team._id == ownProps.id)[0],
});

export default connect(
  mapStateToProps
)(TeamHeading);