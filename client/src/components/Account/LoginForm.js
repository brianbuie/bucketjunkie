import React from 'react';
import { connect } from 'react-redux';
import { A } from 'components/Utilities';
import Form from 'components/Utilities/Form';
import { submitLogin } from 'actions';

const fields = [
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'password', label: 'Password', type: 'password' }
];

const LoginForm = ({ submitLogin, goToForgotPassword, goToRegister }) => (
  <div className="height-100 p-3">
    <h2 className="text-center">
      Login
    </h2>
    <Form fields={fields} submit={submitLogin} buttonText="Log In →" />
    <p className="text-center">
      <A className="link-discreet" click={goToForgotPassword}>Forgot password?</A>
    </p>
    <p className="text-center">
      <span className="faded-2">Need an account?</span>
      <A className="link-discreet" click={goToRegister}> Register</A>
    </p>
  </div>
);

const mapDispatchToProps = dispatch => ({
  submitLogin: data => dispatch(submitLogin(data))
});

export default connect(
  null,
  mapDispatchToProps
)(LoginForm);