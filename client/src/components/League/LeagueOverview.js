import React from 'react';
import moment from 'moment';
import { Row, Col, Button } from 'reactstrap';
import A from 'components/Utilities/A';
import { PageHeading } from 'components/UI';
import UserPhotoAndModal from 'components/User/UserPhotoAndModal';
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
            <h5 className="mb-2">Point Values</h5>
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
            <h5 className="mb-2">Members</h5>
            {league.members.map(member => (
              <div key={member.username} className="flex-row justify-content-start align-items-center py-2">
                <div style={{ width: '30px' }} className="mr-2">
                  <UserPhotoAndModal {...member} />
                </div>
                <p>{member.username}</p>
              </div>
            ))}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LeagueOverview;