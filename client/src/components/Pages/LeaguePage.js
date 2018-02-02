import React from 'react';
import { connect } from 'react-redux';
import AsyncContainer from 'components/Fetch/AsyncContainer';
import LeagueOverview from 'components/League/LeagueOverview';
import { joinLeague, get } from 'actions';
import CenteredLayout from 'components/Layout/CenteredLayout';
import { SpinningBallLoader } from 'features/loading/BallLoaders';

const LeaguePage= props => (
  <CenteredLayout>
    <AsyncContainer
      {...props}
      asyncAction={() => get(`/api/leagues/public/${props.match.params.id}`)} 
      Component={LeagueOverview}
      LoadingComponent={SpinningBallLoader}
    />
  </CenteredLayout>
);

export default connect(
  ({ user }) => ({ user }),
  (dispatch, ownProps) => ({ joinLeague: () => dispatch(joinLeague(ownProps.match.params.id)) })
)(LeaguePage);