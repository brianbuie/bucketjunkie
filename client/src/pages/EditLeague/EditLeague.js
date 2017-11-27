import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { submitLeagueEdit } from '../../actions';
import { Container } from '../../components/Utilities';

const EditLeague = ({ league, submitLeagueEdit }) => {
  let form;
  return(
    <div className="p-3 bg-light mb-4">
      <h3 className="text-center"> Edit League </h3>
      <form
        encType="text/plain"
        onSubmit={e => {
          e.preventDefault();
          let formData = new FormData(form);
          submitLeagueEdit(formData, league.id);
        }}
        ref={el => form = el}
      >
        <FormGroup>
          <Label for="name"> League Name </Label>
          <Input type="text" name="name" id="name" defaultValue={league.name} />
        </FormGroup>

        <FormGroup>
          <Label for="description"> Description </Label>
          <Input type="textarea" name="description" id="description" defaultValue={league.description} />
        </FormGroup>

        <Container>
          <Row>
            <Col sm="3"> Membership </Col>
            <Col sm="9">
              <div className="d-flex flex-row">
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" name="public" defaultChecked={league.public} />{' Public'}
                  </Label>
                </FormGroup>
                <FormGroup check className="ml-3">
                  <Label check>
                    <Input type="checkbox" name="open" defaultChecked={league.open} />{' Allow users to join'}
                  </Label>
                </FormGroup>
              </div>
            </Col>
          </Row>
        </Container>

        {!league._id ? 
          <Container>
            <Row>
              <Col sm="3"> League Type </Col>
              <Col sm="9">
                <div className="d-flex flex-row">
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="leagueType" defaultChecked={league.leagueType != "contest"} />{' Fantasy'}
                    </Label>
                  </FormGroup>
                  <FormGroup check className="ml-3">
                    <Label check>
                      <Input type="radio" name="leagueType" defaultChecked={league.leagueType === "contest"} />{' Contest'}
                    </Label>
                  </FormGroup>
                </div>
              </Col>
            </Row>
          </Container>
        : ''}

        {!league.started ? 
          <div>
            <Container>
              <Row>
                <Col sm="3"> Start </Col>
                <Col sm="9">
                  <FormGroup>
                    <Input type="datetime-local" name="start" defaultValue={league.start} />
                  </FormGroup>
                </Col>
              </Row>
            </Container>

            <Container>
              <Row>
                <Col sm="3"> Roster Size </Col>
                <Col sm="9">
                  <FormGroup>
                    <Input type="number" name="rosterSize" defaultValue={league.rosterSize || 5}/>
                  </FormGroup>
                </Col>
              </Row>
            </Container>

            <Container>
              <h4 className="text-muted text-center mb-3"> Point Values </h4>
              <Row>
                {Object.keys(league.pointValues).map(stat => (
                  <Col xs="6" md="4" key={stat}>
                    <FormGroup>
                      <Row noGutters>
                        <Col xs="6">
                          <div className="text-right pr-2">
                            {stat.toUpperCase()}
                          </div>
                        </Col>
                        <Col xs="6">
                          <Input type="number" id={`pointValues-${stat}`} name={`pointValues-${stat}`} />
                        </Col>
                      </Row>
                    </FormGroup>
                  </Col>
                ))}
              </Row>
            </Container>
          </div> 
        : ''}

        <Container>
          <Button block color="success">
            Save →
          </Button>
        </Container>

      </form>
    </div>
  );
};

const mapStateToProps = ({ league }) => ({ league });

const mapDispatchToProps = dispatch => ({
  submitLeagueEdit: (formData, id) => dispatch(submitLeagueEdit(formData, id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditLeague);