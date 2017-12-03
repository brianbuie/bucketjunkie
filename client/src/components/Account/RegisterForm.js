import React from 'react';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { submitRegister } from 'actions';
import { A } from 'components/Utilities';

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      'confirm-password': ''
    }
    this.fieldChange = this.fieldChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  fieldChange(e) {
    this.setState({
      [e.target.name] : e.target.value
    });
  }

  submitForm(e) {
    e.preventDefault();
    this.props.submitRegister({...this.state});
  }

  render() {
    return (
      <Scrollbars autoHide>
        <div className="bg-light p-3">
          <h2 className="text-center">
            Register
          </h2>
          <form onSubmit={e => this.submitForm(e)}>
            <FormGroup>
              <Label for="username">Username</Label>
              <Input type="text" name="username" value={this.state.username} onChange={this.fieldChange} />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email Address</Label>
              <small className="faded-2"> (for password resets)</small>
              <Input type="email" name="email" value={this.state.email} onChange={this.fieldChange} />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type="password" name="password" value={this.state.password} onChange={this.fieldChange} />
            </FormGroup>
            <FormGroup>
              <Label for="confirm-password">Again</Label>
              <Input type="password" name="confirm-password" value={this.state["confirm-password"]} onChange={this.fieldChange} />
            </FormGroup>
            <Button type="submit" color="success" className="my-3" block>
               Register →
            </Button>
          </form>
          <p className="text-center">
            <span className="faded-2">Already have an account?</span>
            <A className="link-discreet" click={() => this.props.goToLogin()}> Login</A>
          </p>
        </div>
      </Scrollbars>
    );
  }
};

const mapDispatchToProps = dispatch => ({
  submitRegister: data => dispatch(submitRegister(data))
});

export default connect(
  null,
  mapDispatchToProps
)(RegisterForm);