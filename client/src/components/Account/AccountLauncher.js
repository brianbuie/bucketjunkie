import React from 'react';
import { connect } from 'react-redux';
import { submitNewPhoto, submitLogout } from 'actions';
import UserPhoto from 'components/User/UserPhoto';
import AccountModal from 'components/Account/AccountModal';
import { A } from 'components/Utilities';
import Toggle from 'components/Utilities/Toggle';

const AccountLauncher = props => props.user ? (
  <Toggle {...props} toggleState={false} Component={({ user, submitNewPhoto, logout, toggle, toggleState }) => (
    <div>
      <div style={{ width: '30px' }}>
        <A click={toggle}>
          <UserPhoto photo={user.photo} />
        </A>
      </div>
      <AccountModal user={user} toggle={toggle} isOpen={toggleState} submitNewPhoto={submitNewPhoto} logout={logout} />
    </div>
  )} />
) : '';

export default connect(
  ({ user }) => ({ user }),
  dispatch => ({
    submitNewPhoto: photo => dispatch(submitNewPhoto(photo)),
    logout: () => dispatch(submitLogout())
  })
)(AccountLauncher);