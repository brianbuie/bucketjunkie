import React from 'react';
import { connect } from 'react-redux';
import FetchContainer from 'components/FetchManager/FetchContainer';
import LeagueOverview from 'components/League/LeagueOverview';
import { joinLeague } from 'actions';

const LeagueOverviewFetch = props => (
  <FetchContainer url={`/api/leagues/public/${props.match.params.id}`} component={LeagueOverview} {...props} />
);

export default connect(
  ({ user }) => ({ user }),
  (dispatch, ownProps) => ({ joinLeague: () => dispatch(joinLeague(ownProps.match.params.id)) })
)(LeagueOverviewFetch);