import React from 'react';
import { connect } from 'react-redux';
import Roster from './Roster';
import { sortByScore } from '../../helpers';

const Rosters = ({ rosters, scores }) => (
  <div>
    {scores.sort(sortByScore).map(score => {
      const roster = rosters.filter(roster => roster.user._id === score._id)[0];
      return roster ? <Roster {...roster} key={score._id} score={score.score}/> : '';
    })}
  </div>
);

const mapStateToProps = ({ rosters, scores }) => ({ rosters, scores });

export default connect(
  mapStateToProps,
)(Rosters);