import React from 'react';
import { ImageRound } from 'components/UI';

const UserPhoto = ({ photo }) => (
  <ImageRound path={photo ? `/images/uploads/${photo}` : '/images/player-default.png'} />
);

export default UserPhoto;