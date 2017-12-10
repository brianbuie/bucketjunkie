import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { submitCreateLeague } from 'actions';
import LeagueForm from 'components/League/LeagueForm';

const blankLeague = {
  name: '',
  description: '',
  public: true,
  open: true,
  start: moment().add(30, 'minutes'),
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

const mapStateToProps = () => ({ 
  league: blankLeague
});

const mapDispatchToProps = dispatch => ({
  submit: data => dispatch(submitCreateLeague(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeagueForm);