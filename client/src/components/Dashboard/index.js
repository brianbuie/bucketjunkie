import React from 'react';
import { connect } from 'react-redux';
import { addActivityItem, replaceRoster } from '../../actions';
import Dashboard from './Dashboard';

const mapStateToProps = (state) => ({ 
  leagueName: state.league.name,
});

const mapDispatchToProps = dispatch => ({
  addActivityItem: item => dispatch(addActivityItem(item)),
  replaceRoster: roster => dispatch(replaceRoster(roster)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);