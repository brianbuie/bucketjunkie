import React from 'react';
import { connect } from 'react-redux';
import { submitRegister } from 'actions';
import { Link, Redirect } from 'react-router-dom';
import routes from 'routes';
import Form from 'components/Utilities/Form';

const fields = [
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'email', label: 'Email (for password resets)', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'confirm-password', label: 'Again', type: 'password' }
];

const RegisterForm = ({ user, submitRegister }) => !user
  ? (
    <div className="height-100 p-3">
      <h2 className="text-center">
        Register
      </h2>
      <Form fields={fields} submit={submitRegister} buttonText="Register →" />
      <p className="text-center">
        <span className="faded-2">Already have an account?</span>
        <Link to={routes.login}> Login</Link>
      </p>
    </div>
  ) : (
    <Redirect to="/" />
  );

export default connect(
  ({ user }) => ({ user }),
  dispatch => ({
    submitRegister: data => dispatch(submitRegister(data))
  })
)(RegisterForm);