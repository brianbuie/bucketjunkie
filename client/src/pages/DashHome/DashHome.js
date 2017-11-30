import React from 'react';
import { connect } from 'react-redux';
import Draft from 'components/Draft/Draft';
import Rosters from 'components/Rosters/Rosters';

const DashHome = ({ league }) => {
  if (league.drafting) return(<Draft />);
  return (<Rosters />);
}

const mapStateToProps = ({ league }) => ({ league });

export default connect(
  mapStateToProps,
)(DashHome);