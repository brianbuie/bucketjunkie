import React from 'react';

const PlayerImage = ({ path }) => {
  return (
    <div className="rounded-circle player__picture"
      style={{backgroundImage: `url("${path}")`}}
    >
    </div>
  );
};

export default PlayerImage;