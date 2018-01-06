import React from 'react';
import { connect } from 'react-redux';
import FetchContainer from 'components/FetchManager/FetchContainer';
import LeagueOverview from 'components/League/LeagueOverview';
import { joinLeague } from 'actions';
import CenteredLayout from 'components/Layout/CenteredLayout';

const LeaguePage= props => (
  <CenteredLayout>
    <FetchContainer url={`/api/leagues/public/${props.match.params.id}`} component={LeagueOverview} {...props} />
  </CenteredLayout>
);

export default connect(
  ({ user }) => ({ user }),
  (dispatch, ownProps) => ({ joinLeague: () => dispatch(joinLeague(ownProps.match.params.id)) })
)(LeaguePage);