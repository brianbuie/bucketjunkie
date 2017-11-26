import React from 'react';
// import { formatDistance } from 'date-fns';

const League = ({ name, members, start, uniqueRosters, rosterSize, description }) => (
  <div className="py-3">
    <div className="d-flex flex-row">
      <h4 className="my-0 mr-auto text-truncate">
        {name}
      </h4>
      <p className="my-0">
        {`${members.length} Member${members.length > 1 ? 's' : ''}`}
      </p>
    </div>
    <small className="faded-2">
      {`${uniqueRosters ? 'Fantasy' : 'Contest'} | ${rosterSize} Players`}
    </small>
    <p className="m-0">
      {description}
    </p>
  </div>
);

export default League;