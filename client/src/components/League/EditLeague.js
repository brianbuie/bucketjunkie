import React from 'react';
import { connect } from 'react-redux';
import { submitLeagueEdit } from 'actions';
import LeagueForm from 'components/League/LeagueForm';

const mapStateToProps = ({ league }) => ({ league });

const mapDispatchToProps = dispatch => ({
  submit: data => dispatch(submitLeagueEdit(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeagueForm);