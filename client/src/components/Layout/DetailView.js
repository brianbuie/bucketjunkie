import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { clearDetailView } from 'actions';
import { Panel } from 'components/UI';
import PlayerContainer from 'components/Player/PlayerContainer';
import PlayerDetail from 'components/Player/PlayerDetail';
import CreateLeague from 'components/League/CreateLeague';

const DetailView = ({ type, details, clearDetailView }) => {
  switch (type) {
    case 'PLAYER':
      return (
        <div className="height-100">
          <PlayerContainer id={details.id} component={PlayerDetail} close={clearDetailView} />
        </div>
      );
    case 'CREATE_LEAGUE':
      return (
        <div className="height-100">
          <Panel close={clearDetailView}>
            <CreateLeague />
          </Panel>
        </div>
      );
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