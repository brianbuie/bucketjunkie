import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from 'routes';
import SingleColumnSmall from 'components/Layout/SingleColumnSmall';
import LoginForm from 'components/Account/LoginForm';
import RegisterForm from 'components/Account/RegisterForm';
import ForgotPasswordForm from 'components/Account/ForgotPasswordForm';
import ResetPasswordForm from 'components/Account/ResetPasswordForm';

const Account = () => (
  <SingleColumnSmall>
    <Switch>
      <Route path={routes.login} component={LoginForm} />
      <Route path={routes.register} component={RegisterForm} />
      <Route path={routes.forgotPassword} component={ForgotPasswordForm} />
      <Route path={routes.resetPassword} component={ResetPasswordForm} />
    </Switch>
  </SingleColumnSmall>
);

export default Account;