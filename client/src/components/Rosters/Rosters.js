import React from 'react';
import { connect } from 'react-redux';
import { PageHeading } from 'components/UI';
import Roster from 'components/Rosters/Roster';
import { sortByScore } from 'helpers';

const Rosters = ({ rosters, scores, league }) => (
  <div>
    <PageHeading eyebrow={league.name} headline="Rosters" />
    {scores.sort(sortByScore).map((score, key) => {
      const leader = key === 0 && score.score != 0;
      const roster = rosters.filter(roster => roster.user._id === score._id)[0];
      const emptySpots = roster && roster.players ? league.rosterSize - roster.players.length : league.rosterSize;
      return roster ? <Roster {...roster} key={score._id} score={score.score} leader={leader} emptySpots={emptySpots} /> : '';
    })}
  </div>
);

const mapStateToProps = ({ rosters, scores, league }) => ({ rosters, scores, league });

export default connect(
  mapStateToProps,
)(Rosters);