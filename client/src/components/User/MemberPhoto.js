import React from 'react';
import MemberContainer from 'components/User/MemberContainer';
import UserPhoto from 'components/User/UserPhoto';

const MemberPhoto = ({ id }) => (
  <MemberContainer id={id} Component={({ photo }) => (
    <UserPhoto photo={photo} />
  )} />
);

export default MemberPhoto;