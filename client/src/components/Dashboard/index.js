import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { addActivityItem, replaceRoster } from '../../actions';
import Dashboard from './Dashboard';

const mapStateToProps = (state) => ({ 
  leagueName: state.league.name,
  leagueAuth: state.leagueAuth,
});

const mapDispatchToProps = dispatch => ({
  addActivityItem: item => dispatch(addActivityItem(item)),
  replaceRoster: roster => dispatch(replaceRoster(roster)),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard));