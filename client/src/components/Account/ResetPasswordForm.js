import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { submitPasswordReset, validatePasswordResetToken } from 'actions';
import { Link, Redirect } from 'react-router-dom';
import routes from 'routes';
import Form from 'components/Utilities/Form';
import AsyncContainer from 'components/Fetch/AsyncContainer';

const ResetPasswordForm = (props) => !props.user 
 ? (
    <AsyncContainer 
      {...props} 
      asyncAction={() => props.validatePasswordResetToken(props.token)} 
      Component={({ token, submitPasswordReset }) => (
        <div className="p-3 height-100">
          <h2 className="text-center">
            Reset Password
          </h2>
          <Form 
            fields={[ 
              { name: 'password', label: 'Password', type: 'password' },
              { name: 'confirm-password', label: 'Again', type: 'password' },
              { name: 'token', type: 'hidden', value: token } 
            ]}
            submit={submitPasswordReset} 
            buttonText="Reset →"
          />
          <p className="text-center">
            <Link to={routes.login}>Cancel</Link>
          </p>
        </div>
      )} />
  ) : (
    <Redirect to="/" />
  );

export default connect(
  ({ router, user }) => ({ user, token: queryString.parse(router.location.search)['token'] }),
  dispatch => ({
    submitPasswordReset: data => dispatch(submitPasswordReset(data)),
    validatePasswordResetToken: token => dispatch(validatePasswordResetToken(token))
  })
)(ResetPasswordForm);