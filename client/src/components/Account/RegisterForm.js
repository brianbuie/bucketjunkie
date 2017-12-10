import React from 'react';
import { connect } from 'react-redux';
import { submitRegister } from 'actions';
import { A, FullHeight } from 'components/Utilities';
import Form from 'components/Utilities/Form';

const fields = [
  { name: 'username', label: 'Username', type: 'text' },
  { name: 'email', label: 'Email (for password resets)', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'confirm-password', label: 'Again', type: 'password' }
];

const RegisterForm = ({ submitRegister, goToLogin }) => (
  <FullHeight>
    <div className="bg-light p-3">
      <h2 className="text-center">
        Register
      </h2>
      <Form fields={fields} submit={submitRegister} buttonText="Register →" />
      <p className="text-center">
        <span className="faded-2">Already have an account?</span>
        <A className="link-discreet" click={goToLogin}> Login</A>
      </p>
    </div>
  </FullHeight>
);

const mapDispatchToProps = dispatch => ({
  submitRegister: data => dispatch(submitRegister(data))
});

export default connect(
  null,
  mapDispatchToProps
)(RegisterForm);