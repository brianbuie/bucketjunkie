import React from 'react';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import { Row, Col } from 'reactstrap';
import { isModerator, isMember, isCreator } from 'helpers';
import { leaveLeague } from 'actions';
import { A } from 'components/Utilities';
import LeagueOverview from 'components/League/LeagueOverview';

const LeagueOverviewConnected = ({ league, user, goToLeagueEdit, leaveLeague }) => (
  <LeagueOverview 
    league={league}
    user={user}
    goToLeagueEdit={isModerator(league, user) ? goToLeagueEdit : null}
    leaveLeague={(isMember(league, user) && !isCreator(league, user)) ? leaveLeague : null}
  />
);

const mapStateToProps = ({ league, user }) => ({ league, user });

const mapDispatchToProps = dispatch => ({
  leaveLeague: id => dispatch(leaveLeague(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeagueOverviewConnected);