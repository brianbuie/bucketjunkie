import React from 'react';
import { Row, Col } from 'reactstrap';
import { truncateText } from 'helpers';

const LeagueCard = ({ name, members, start, uniqueRosters, rosterSize, description }) => (
  <div className="py-3 flex-grow">
    <Row noGutters>
      <Col xs="8">
        <h4 className="my-0 text-truncate">
          {name}
        </h4>
      </Col>
      <Col xs="4">
        <p className="my-0 text-right">
          {`${members.length} Member${members.length > 1 ? 's' : ''}`}
        </p>
      </Col>
    </Row>
    <small className="faded-2">
      {`${uniqueRosters ? 'Fantasy' : 'Contest'} | ${rosterSize} Players`}
    </small>
    <p className="m-0">
      {truncateText({ text: description, length: 100 })}
    </p>
  </div>
);

export default LeagueCard;