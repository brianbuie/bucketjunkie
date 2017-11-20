import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { submitLogin } from '../../actions';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
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
    this.props.submitLogin({...this.state});
  }

  render() {
    return (
      <div>
        <h2 className="text-center">
          Login
        </h2>
        <form onSubmit={e => this.submitForm(e)}>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input type="text" name="username" value={this.state.username} onChange={this.fieldChange} />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" value={this.state.password} onChange={this.fieldChange} />
            <small><a className="link-discreet" href="/account/forgot-password">Forgot?</a></small>
          </FormGroup>
          <Button type="submit" color="success" className="my-3" block>
             Log In →
          </Button>
        </form>
        <p className="text-center">
          <span className="faded-2">Need an account?</span>
          <a className="link-discreet" href="/account/register"> Register</a>
        </p>
      </div>
    );
  }
};

const mapDispatchToProps = dispatch => ({
  submitLogin: data => dispatch(submitLogin(data))
});

export default connect(
  null,
  mapDispatchToProps
)(LoginPage);