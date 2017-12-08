import './ui.scss';

import React from 'react';

export const ImageRound = ({ path }) => (
  <div className="rounded-circle Image--Round"
    style={{backgroundImage: `url("${path}")`}}
  >
  </div>
);