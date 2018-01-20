import React from 'react';
import { connect } from 'react-redux';
import UserPhoto from 'components/User/UserPhoto';
import Toggle from 'components/Utilities/Toggle';
import UserModal from 'components/User/UserModal';
import { submitNewPhoto, submitLogout } from 'actions';
import { A } from 'components/Utilities';

const UserPhotoAndModal = props => (
  <Toggle {...props} toggleState={false} Component={props => (
    <div>
      <A click={props.toggle} key="link">
        <UserPhoto {...props} />
      </A>
      <UserModal
        username={props.username}
        photo={props.photo}
        toggle={props.toggle}
        isOpen={props.toggleState} 
        submitNewPhoto={(props.user && props.user._id == props.id) ? props.submitNewPhoto : null} 
        logout={(props.user && props.user._id == props.id) ? props.logout : null} 
      />
    </div>
  )} />
);

export default connect(
  ({ user }) => ({ user }),
  dispatch => ({
    submitNewPhoto: photo => dispatch(submitNewPhoto(photo)),
    logout: () => dispatch(submitLogout())
  })
)(UserPhotoAndModal);