import React from 'react';
import { connect } from 'react-redux';
import PlayerDetail from 'components/Player/PlayerDetail';

const DetailView = ({ type, details }) => {
  switch (type) {
    case 'PLAYER':
      return <PlayerDetail id={details.id} />
    default:
      return '';
  }
};

const mapStateToProps = ({ detailView }) => ({ ...detailView });

export default connect(
  mapStateToProps
)(DetailView);