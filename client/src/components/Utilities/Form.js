import React from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';

class Form extends React.Component {
  componentDidMount = () => {
    let state = {};
    this.props.fields.map(field => {
      state[field.name] = field.value || '';
    });
    this.setState(state);
  }

  fieldChange = e => {
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  submitForm = e => {
    e.preventDefault();
    this.props.submit({...this.state});
  }

  render = () => this.state ? (
    <form onSubmit={this.submitForm}>
      {this.props.fields.map(field => (
        <FormGroup key={field.name}>
          {field.label ? <Label for={field.name}>{field.label}</Label> : ''}
          <Input type={field.type} name={field.name} value={this.state[field.name]} onChange={this.fieldChange} />
        </FormGroup>
      ))}
      <Button type="submit" color="success" className="my-3" block>
         {this.props.buttonText || 'Submit →'}
      </Button>
    </form>
  ) : '';
};

export default Form;