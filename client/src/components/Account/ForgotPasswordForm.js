import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { A } from 'components/Utilities';
import { submitForgotPassword } from 'actions';

class ForgotPasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
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
    this.props.submitForgotPassword({...this.state});
  }

  render() {
    return (
      <div className="bg-light height-100 p-3">
        <h2 className="text-center">
          Forgot Password
        </h2>
        <form onSubmit={e => this.submitForm(e)}>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" name="email" value={this.state.email} onChange={this.fieldChange} />
          </FormGroup>
          <Button type="submit" color="success" className="my-3" block>
             Send Reset →
          </Button>
        </form>
        <p className="text-center">
          <A className="link-discreet" click={() => this.props.goToLogin()}>← Login</A>
        </p>
      </div>
    );
  }
};

const mapDispatchToProps = dispatch => ({
  submitForgotPassword: data => dispatch(submitForgotPassword(data))
});

export default connect(
  null,
  mapDispatchToProps
)(ForgotPasswordForm);