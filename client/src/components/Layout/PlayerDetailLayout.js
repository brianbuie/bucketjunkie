import React from 'react';
import { connect } from 'react-redux';
import { clearPlayerDetail } from 'actions';
import { Row, Col } from 'reactstrap';
import { Container } from 'components/UI';
import { Scrollbars } from 'react-custom-scrollbars';
import PlayerContainer from 'components/Player/PlayerContainer';
import PlayerDetail from 'components/Player/PlayerDetail';

const PlayerDetailLayout = ({ children, id, close }) => (
  <Row noGutters className="flex-grow full-height">
    <Col xs="12" lg="5" className="height-100">
      {children}
    </Col>
    {id && <Col xs="12" lg="7" className="height-100 PlayerDetail__Wrapper">
      <Scrollbars autoHide>
        <Container size="4" className="width-100 height-100">
          <PlayerContainer id={id} component={PlayerDetail} close={close} />
        </Container>
      </Scrollbars>
    </Col>}
  </Row>
);

export default connect(
  ({ playerDetailView }) => ({ id: playerDetailView }),
  dispatch => ({
    close: () => dispatch(clearPlayerDetail())
  })
)(PlayerDetailLayout);