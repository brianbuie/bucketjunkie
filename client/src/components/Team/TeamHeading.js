import './TeamHeading.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import TeamIcon from 'components/Team/TeamIcon';

const TeamHeading = ({ id, name, city }) => (
  <Row className="TeamHeading" noGutters>
    <Col className="flex-column justify-content-end px-2">
      <span className="faded-2">{city || 'NBA'}</span>
      <h2>{name || 'Top Players'}</h2>
    </Col>
    <Col xs="2">
      <TeamIcon id={id || 'nba'} />
    </Col>
  </Row>
);

const mapStateToProps = (state, ownProps) => ({
  ...state.teams.filter(team => team._id == ownProps.id)[0],
  ...ownProps
});

export default connect(
  mapStateToProps
)(TeamHeading);