import React from 'react';
import { connect } from 'react-redux';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import A from 'components/Utilities/A';
import Form from 'components/Utilities/Form';
import { submitForgotPassword } from 'actions';

const fields = [
  { name: 'email', label: 'Email', type: 'email' }
];

const ForgotPasswordForm = ({ submitForgotPassword, goToLogin }) => (
  <div className="height-100 p-3">
    <h2 className="text-center">
      Forgot Password
    </h2>
    <Form fields={fields} submit={submitForgotPassword} buttonText="Send Reset →" />
    <p className="text-center">
      <A className="link-discreet" click={goToLogin}>← Login</A>
    </p>
  </div>
);

const mapDispatchToProps = dispatch => ({
  submitForgotPassword: data => dispatch(submitForgotPassword(data))
});

export default connect(
  null,
  mapDispatchToProps
)(ForgotPasswordForm);