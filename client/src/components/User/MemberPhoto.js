import React from 'react';
import { connect } from 'react-redux';
import MemberContainer from 'components/User/MemberContainer';
import UserPhoto from 'components/User/UserPhoto';
import Toggle from 'components/Utilities/Toggle';
import UserModal from 'components/User/UserModal';
import { submitNewPhoto, submitLogout } from 'actions';
import { A } from 'components/Utilities';

const MemberPhoto = props => (
  <MemberContainer {...props} Component={props => (
    <Toggle {...props} toggleState={false} Component={props => props.noLink
      ? (
        <UserPhoto photo={props.photo} />
      ) : (
        <div>
          <A click={props.toggle} key="link">
            <UserPhoto photo={props.photo} />
          </A>
          <UserModal 
            user={{ _id: props._id, photo: props.photo, username: props.username }} 
            toggle={props.toggle} 
            isOpen={props.toggleState} 
            submitNewPhoto={props.submitNewPhoto} 
            logout={props.logout} 
            isSelf={props.user._id == props._id}
          />
        </div>
      )
    } />
  )} />
);

export default connect(
  ({ user }) => ({ user }),
  dispatch => ({
    submitNewPhoto: photo => dispatch(submitNewPhoto(photo)),
    logout: () => dispatch(submitLogout())
  })
)(MemberPhoto);