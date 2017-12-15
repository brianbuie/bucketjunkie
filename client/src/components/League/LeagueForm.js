import React from 'react';
import moment from 'moment';
import { Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { A, FullHeight } from 'components/Utilities';

class LeagueForm extends React.Component {
  componentDidMount = () => {
    this.setState({
      ...this.props.league,
      start: moment(this.props.league.start).format('YYYY-MM-DDTHH:mm')
    });
  }

  fieldChange = e => {
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  toggleCheckbox = e => {
    this.setState({
      [e.target.name] : !this.state[e.target.name]
    });
  }

  pointValueChange = e => {
    this.setState({
      pointValues: { 
        ...this.state.pointValues,
        [e.target.name] : e.target.value
      }
    });
  }

  submitForm = e => {
    e.preventDefault();
    this.props.submit({
      ...this.state,
      start: moment(this.state.start).toISOString()
    });
  }

  render = () => {
    return this.state ? (
      <FullHeight>
        <div className="p-3 height-100">
          <h2 className="text-center">
            {this.state._id ? 'Edit League' : 'Create League'}
          </h2>
          <form onSubmit={this.submitForm}>

            <FormGroup>
              <Label for="name"> League Name </Label>
              <Input type="text" name="name" id="name" value={this.state.name} onChange={this.fieldChange} />
            </FormGroup>

            <FormGroup>
              <Label for="description"> Description </Label>
              <Input type="textarea" name="description" value={this.state.description} onChange={this.fieldChange} />
            </FormGroup>

            <Row className="py-2">
              <Col sm="3"> Membership </Col>
              <Col sm="9" className="flex-row">
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" name="public" checked={this.state.public} onChange={this.toggleCheckbox} />{' Public'}
                  </Label>
                </FormGroup>
                <FormGroup check className="ml-3">
                  <Label check>
                    <Input type="checkbox" name="open" checked={this.state.open} onChange={this.toggleCheckbox} />{' Allow users to join'}
                  </Label>
                </FormGroup>
              </Col>
            </Row>

            {!this.state.started ? (<div>

              <Row className="py-2">
                <Col sm="3"> Start </Col>
                <Col sm="9">
                  <FormGroup>
                    <Input type="datetime-local" name="start" value={this.state.start} onChange={this.fieldChange} />
                  </FormGroup>
                </Col>
              </Row>

              <Row className="py-2">
                <Col sm="3"> Roster Size </Col>
                <Col sm="9">
                  <FormGroup>
                    <Input type="number" name="rosterSize" value={this.state.rosterSize} onChange={this.fieldChange}/>
                  </FormGroup>
                </Col>
              </Row> 

              <div className="py-2">
                <h4 className="text-muted text-center mb-3"> Point Values </h4>
                <Row>
                  {Object.keys(this.state.pointValues).map(stat => (
                    <Col xs="6" key={stat}>
                      <FormGroup>
                        <Row noGutters>
                          <Col xs="6">
                            <div className="text-right pr-2">
                              {stat.toUpperCase()}
                            </div>
                          </Col>
                          <Col xs="6">
                            <Input type="number" id={stat} name={stat} value={this.state.pointValues[stat]} onChange={this.pointValueChange} />
                          </Col>
                        </Row>
                      </FormGroup>
                    </Col>
                  ))}
                </Row>
              </div>

            </div>) : ''}

            <Button type="submit" color="success" className="my-3" block>
               Save →
            </Button>
          </form>
        </div>
      </FullHeight>
    ) : '';
  }
};

export default LeagueForm;