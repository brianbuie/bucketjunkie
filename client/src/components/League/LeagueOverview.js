import React from 'react';
import moment from 'moment';
import { Row, Col, Button } from 'reactstrap';
import { A } from 'components/Utilities';
import { PageHeading } from 'components/UI';
import { isMember } from 'helpers';

const LeagueOverview = ({ league, user, goToLeagueEdit, leaveLeague, joinLeague }) => {
  const startVerb = moment(league.start).isBefore(moment()) ? 'Started' : 'Starting';
  const type = league.uniqueRosters ? 'Fantasy' : 'Contest';
  const subhead = `${type} | ${league.rosterSize} players | ${startVerb} ${moment(league.start).fromNow()}`;
  const canJoin = user && league.open && joinLeague && !isMember(league, user);
  return (
    <div>
      <PageHeading eyebrow="League" headline={league.name} subhead={subhead}>
        {goToLeagueEdit && <Button color="primary" outline onClick={goToLeagueEdit}>Edit</Button>}
        {canJoin && <Button color="success" outline onClick={joinLeague}>Join</Button>}
        {leaveLeague && <A className="text-danger" click={() => leaveLeague(league.id)}>Leave</A>}
      </PageHeading>
      <div className="px-2">
        <p className="py-2">
          {league.description}
        </p>
        <Row>
          <Col xs="6">
            <h5>Point Values</h5>
            {Object.keys(league.pointValues).map(pointValueName => (
              <div key={pointValueName} className="flex-row justify-content-between py-1 pr-3">
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
            {league.members.map(member => (
              <div key={member.username} className="flex-row justify-content-between py-1 pr-3">
                <p className="my-0">{member.username}</p>
              </div>
            ))}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LeagueOverview;