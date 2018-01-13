import React from 'react';
import { connect } from 'react-redux';
import { clearPlayerDetail } from 'actions';
import { Row, Col } from 'reactstrap';
import { Container } from 'components/UI';
import { Scrollbars } from 'react-custom-scrollbars';
import PlayerContainer from 'components/Player/PlayerContainer';
import PlayerDetail from 'components/Player/PlayerDetail';

const PlayerDetailLayout = ({ children, id, close }) => (
  <Row noGutters className="flex-grow height-100">
    <Col xs="5">
      {children}
    </Col>
    <Col xs="7">
      <Scrollbars autoHide>
        <Container size="4" className="width-100 height-100">
          {id && <PlayerContainer id={id} component={PlayerDetail} close={close} />}
        </Container>
      </Scrollbars>
    </Col>
  </Row>
);

export default connect(
  ({ playerDetailView }) => ({ id: playerDetailView }),
  dispatch => ({
    close: () => dispatch(clearPlayerDetail())
  })
)(PlayerDetailLayout);