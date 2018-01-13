import React from 'react';
import PlayerList from 'components/Player/PlayerList';
import PlayerListItem from 'components/Player/PlayerListItem';
import UserPhoto from 'components/User/UserPhoto';
import { Row, Col } from 'reactstrap';
import { Panel } from 'components/UI';

const Roster = ({ user, score, players, leader, emptySpots }) => (
  <Panel>
    <Row className="px-3 py-3 bg-dark" noGutters>
      <Col xs="2" className="flex-column justify-content-center pr-2">
        <UserPhoto photo={user.photo} />
      </Col>
      <Col xs="6" className="flex-column justify-content-center pr-2">
        <h3 className={`font-weight-normal ${leader ? 'text-primary' : ''}`}> {user.username} </h3>
      </Col>
      <Col xs="4" className="flex-column justify-content-center text-right">
        <h2 className={leader ? 'text-primary' : ''}> {score} </h2>
      </Col>
    </Row>
    <PlayerList filter={{ type: 'SORTED_LIST', list: players }} />
    {emptySpots > 0 ? [...Array(emptySpots)].map((p, k) => (
      <PlayerListItem key={k} />
    )) : ''}
  </Panel>
);

export default Roster;