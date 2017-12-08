import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { clearDetailView } from 'actions';
import PlayerDetail from 'components/Player/PlayerDetail';

const DetailView = ({ type, details, clearDetailView }) => {
  if (type === '') return '';
  return (
    <div>
      <Button className="close" onClick={clearDetailView}>
        &times;
      </Button>
      <DetailBody type={type} details={details} />
    </div>
  );
};

const DetailBody = ({ type, details }) => {
  switch (type) {
    case 'PLAYER':
      return <PlayerDetail id={details.id} />
    default:
      return '';
  }
};

const mapStateToProps = ({ detailView }) => ({ ...detailView });

const mapDispatchToProps = dispatch => ({
  clearDetailView: () => dispatch(clearDetailView())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailView);