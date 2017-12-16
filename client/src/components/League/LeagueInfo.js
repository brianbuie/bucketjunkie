import React from 'react';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import { Row, Col } from 'reactstrap';
import { isModerator } from 'helpers';
import { leaveLeague } from 'actions';
import { A } from 'components/Utilities';

const LeagueInfo = ({ league, user, goToLeagueEdit, leaveLeague }) => {
  const startVerb = moment(league.start).isBefore(moment()) ? 'Started' : 'Starting';
  const type = league.uniqueRosters ? 'Fantasy' : 'Contest';
  return (
    <Scrollbars autoHide>
      <div className="p-3">
        <h3> {league.name} </h3>
        {isModerator(league, user) ? <p><A click={goToLeagueEdit}>Edit</A></p> : ''}
        <small className="faded-2">
          {`${type} | ${league.rosterSize} players | ${startVerb} ${moment(league.start).fromNow()}`}
        </small>
        <p className="p-0">
          {league.description}
        </p>
        <Row>
          <Col xs="6">
            <h5>Point Values</h5>
            {Object.keys(league.pointValues).map((pointValueName, key) => (
              <div key={key} className="flex-row justify-content-between py-1 pr-3">
                <div className="faded-1">
                  {pointValueName.toUpperCase()}
                </div>
                <div className="text-right">
                  {league.pointValues[pointValueName]}
                </div>
              </div>
            ))}
          </Col>
          <Col xs="6">
            <h5>Members</h5>
            {league.members.map((member, key) => {
              let canLeave = (league.creator.id != member.id && member.id === user.id);
              return (
                <div key={key} className="flex-row justify-content-between py-1 pr-3">
                  <p className="my-0">{member.username}</p>
                  <p className="my-0">{canLeave 
                    ? <A click={() => leaveLeague(league.id)}>Leave</A>
                    : ''}
                  </p>
                </div>
              );
            })}
          </Col>
        </Row>
      </div>
    </Scrollbars>
  );
};

const mapStateToProps = ({ league, user }) => ({ league, user });

const mapDispatchToProps = dispatch => ({
  leaveLeague: id => dispatch(leaveLeague(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeagueInfo);