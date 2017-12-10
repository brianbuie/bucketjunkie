import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { clearDetailView } from 'actions';
import PlayerContainer from 'components/Player/PlayerContainer';
import PlayerDetail from 'components/Player/PlayerDetail';
import CreateLeague from 'components/League/CreateLeague';

const DetailView = ({ type, details, clearDetailView }) => {
  if (type === '') return '';
  return (
    <div className="height-100">
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
      return <PlayerContainer id={details.id} component={PlayerDetail}/>
    case 'CREATE_LEAGUE':
      return <CreateLeague />
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