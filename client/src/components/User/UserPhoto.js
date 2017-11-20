import React from 'react';

const UserPhoto = ({ photo }) => (
  <div style={{ 
    position: 'relative', 
    width: '100%',
    padding: 0,
    paddingBottom: '100%',
    backgroundImage: `url('${photo ? `/images/uploads/${photo}` : '/images/user-default.png'}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '50%'
  }}>
  </div>
);

export default UserPhoto;