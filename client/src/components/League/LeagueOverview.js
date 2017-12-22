import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import { Row, Col, Button } from 'reactstrap';
import { A } from 'components/Utilities';
import PageHeading from 'components/UI/PageHeading';

const LeagueOverview = ({ league, user, goToLeagueEdit, leaveLeague, joinLeague }) => {
  const startVerb = moment(league.start).isBefore(moment()) ? 'Started' : 'Starting';
  const type = league.uniqueRosters ? 'Fantasy' : 'Contest';
  return (
    <Scrollbars autoHide>
      <PageHeading
        eyebrow="League"
        headline={league.name}
        subhead={`${type} | ${league.rosterSize} players | ${startVerb} ${moment(league.start).fromNow()}`}
      >
        {goToLeagueEdit ? <p><A click={goToLeagueEdit}>Edit</A></p> : ''}
        {joinLeague ? <Button color="success" onClick={joinLeague}>Join</Button> : ''}
      </PageHeading>
      <div className="px-2">
        <p className="py-2">
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
              let canLeave = (leaveLeague && user && user.id === member.id);
              return (
                <div key={key} className="flex-row justify-content-between py-1 pr-3">
                  <p className="my-0">{member.username}</p>
                  <p className="my-0">{canLeave ? <A click={() => leaveLeague(league.id)}>Leave</A> : ''}</p>
                </div>
              );
            })}
          </Col>
        </Row>
      </div>
    </Scrollbars>
  );
};

export default LeagueOverview;