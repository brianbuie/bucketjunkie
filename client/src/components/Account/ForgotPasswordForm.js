import React from 'react';
import { connect } from 'react-redux';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import routes from 'routes';
import Form from 'components/Utilities/Form';
import { submitForgotPassword } from 'actions';

const fields = [
  { name: 'email', label: 'Email', type: 'email' }
];

const ForgotPasswordForm = ({ user, submitForgotPassword }) => !user 
  ? (
    <div className="height-100 p-3">
      <h2 className="text-center">
        Forgot Password
      </h2>
      <Form fields={fields} submit={submitForgotPassword} buttonText="Send Reset →" />
      <p className="text-center">
        <Link to={routes.login}>← Login</Link>
      </p>
    </div>
  ) : (
    <Redirect to="/" />
  );

export default connect(
  ({ user }) => ({ user }),
  dispatch => ({
    submitForgotPassword: data => dispatch(submitForgotPassword(data))
  })
)(ForgotPasswordForm);