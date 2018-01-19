import React from 'react';
import { connect } from 'react-redux';
import MemberContainer from 'components/User/MemberContainer';
import UserPhoto from 'components/User/UserPhoto';
import Toggle from 'components/Utilities/Toggle';
import UserModal from 'components/User/UserModal';
import { submitNewPhoto, submitLogout } from 'actions';
import { A } from 'components/Utilities';

const MemberPhoto = props => props.noLink 
  ? (
    <UserPhoto photo={props.photo} />
  ) : (
    <Toggle {...props} toggleState={false} Component={props => (
      <div>
        <A click={props.toggle} key="link">
          {props.league
            ? <MemberContainer id={props.id} {...props} Component={UserPhoto} />
            : <UserPhoto photo={props.photo} />
          }
        </A>
        <UserModal 
          user={props.user._id == props.id 
            ? props.user
            : props.league.members.find(member => member._id == props.id)
          }
          toggle={props.toggle} 
          isOpen={props.toggleState} 
          submitNewPhoto={props.submitNewPhoto} 
          logout={props.logout} 
          isSelf={props.user._id == props.id}
        />
      </div>
    )} />
  );

export default connect(
  ({ user, league }) => ({ user, league }),
  dispatch => ({
    submitNewPhoto: photo => dispatch(submitNewPhoto(photo)),
    logout: () => dispatch(submitLogout())
  })
)(MemberPhoto);