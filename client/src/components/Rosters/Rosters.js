import React from 'react';
import { connect } from 'react-redux';
import PageHeading from 'components/UI/PageHeading';
import Roster from 'components/Rosters/Roster';
import { sortByScore } from 'helpers';

const Rosters = ({ rosters, scores, league }) => (
  <div>
    <PageHeading eyebrow={league.name} headline="Rosters" />
    {scores.sort(sortByScore).map(score => {
      const roster = rosters.filter(roster => roster.user._id === score._id)[0];
      return roster ? <Roster {...roster} key={score._id} score={score.score}/> : '';
    })}
  </div>
);

const mapStateToProps = ({ rosters, scores, league }) => ({ rosters, scores, league });

export default connect(
  mapStateToProps,
)(Rosters);