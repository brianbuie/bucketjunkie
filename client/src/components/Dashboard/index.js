import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { addActivityItem, replaceRoster, replaceLeague } from '../../actions';
import Dashboard from './Dashboard';

const mapStateToProps = (state) => ({ 
  league: state.league,
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  addActivityItem: item => dispatch(addActivityItem(item)),
  replaceRoster: roster => dispatch(replaceRoster(roster)),
  replaceLeague: league => dispatch(replaceLeague(league)),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard));