import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { submitPasswordReset } from 'actions';
import { A } from 'components/Utilities';
import Form from 'components/Utilities/Form';

const ResetPasswordForm = ({ fields, submitPasswordReset }) => (
  <div className="p-3 height-100">
    <h2 className="text-center">
      Reset Password
    </h2>
    <Form fields={fields} submit={submitPasswordReset} buttonText="Reset →" />
  </div>
);

const mapStateToProps = ({ router }) => ({
  fields: [
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'confirm-password', label: 'Again', type: 'password' },
    { name: 'token', type: 'hidden', value: queryString.parse(router.location.search)['password-reset'] }
  ]
})

const mapDispatchToProps = dispatch => ({
  submitPasswordReset: data => dispatch(submitPasswordReset(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordForm);