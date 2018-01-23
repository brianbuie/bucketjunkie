import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import routes from 'routes';
import Form from 'components/Utilities/Form';
import { submitLogin } from 'actions';

const fields = [
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'password', label: 'Password', type: 'password' }
];

const LoginForm = ({ user, submitLogin }) => !user 
  ? (
    <div className="height-100 p-3">
      <h2 className="text-center">
        Login
      </h2>
      <Form fields={fields} submit={submitLogin} buttonText="Log In →" />
      <p className="text-center">
        <Link to={routes.forgotPassword}>Forgot password?</Link>
      </p>
      <p className="text-center">
        <span className="faded-2">Need an account?</span>
        <Link to={routes.register}> Register</Link>
      </p>
    </div>
  ) : (
    <Redirect to="/" />
  );

export default connect(
  ({ user }) => ({ user }),
  dispatch => ({
    submitLogin: data => dispatch(submitLogin(data))
  })
)(LoginForm);