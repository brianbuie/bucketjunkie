import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { submitCreateLeague } from 'actions';
import LeagueForm from 'components/League/LeagueForm';
import CenteredLayout from 'components/Layout/CenteredLayout';

const blankLeague = {
  name: '',
  description: '',
  public: true,
  open: true,
  start: moment().add(7, 'days'),
  rosterSize: 5,
  uniqueRosters: true,
  pointValues: {
    ftm: 0,
    fg2m: 1,
    fg3m: 2,
    reb: 1,
    ast: 1,
    blk: 2,
    stl: 2,
    to: -1
  }
};

const CreateLeague = ({ submit }) => (
  <CenteredLayout>
    <LeagueForm submit={submit} league={blankLeague} />
  </CenteredLayout>
);

export default connect(
  null,
  dispatch => ({
    submit: data => dispatch(submitCreateLeague(data))
  })
)(CreateLeague);