import React from 'react';
import moment from 'moment';
import { Row, Col } from 'reactstrap';

const LeagueOverview = ({ league, user }) => {
  const startVerb = moment(league.start).isBefore(moment()) ? 'Started' : 'Starting';
  const type = league.uniqueRosters ? 'Fantasy' : 'Contest';

  return (
    <div className="p-3">
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
            <div key={key} className="d-flex flex-row justify-content-between striped py-1 px-3">
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
          {league.members.map((member, key) => (
            <div key={key} className="d-flex flex-row justify-content-between striped py-1 px-3">
              <p className="my-0">{member.username}</p>
              <p className="my-0">[Leave]</p>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default LeagueOverview;