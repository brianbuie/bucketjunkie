import React from 'react';
import { connect } from 'react-redux';
import TeamIcon from 'components/Team/TeamIcon';
import { PageHeading } from 'components/UI';

const TeamHeading = ({ id, name, city }) => (
  <PageHeading eyebrow={city || 'NBA'} headline={name || 'Top Players'}>
    <TeamIcon id={id || 'nba'} />
  </PageHeading>
);

export default TeamHeading;