import React from 'react';
import { connect } from 'react-redux';
import Roster from './Roster';

const RostersComponent = ({ rosters, scores }) => (
  <div>
    {rosters.map((roster, key) => {
      const score = scores.filter(score => score._id === roster.user._id);
      return (
        <Roster {...roster} key={roster.user.username} score={score}/>
      );
    })}
  </div>
);

const mapStateToProps = (state) => ({
  rosters: state.rosters,
  scores: state.scores
});

const RostersContainer = connect(
  mapStateToProps,
)(RostersComponent);

export default RostersContainer;