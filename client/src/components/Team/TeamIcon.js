import React from 'react';

const TeamIcon = ({ id, className, style }) => (
  <img className={`TeamIcon ${className || ''}`} style={style} src={`/images/teams/${id}.svg`} />
);

export default TeamIcon;