import React from 'react';
import { truncateText } from 'helpers';

const LeagueCard = ({ name, members, start, uniqueRosters, rosterSize, description }) => (
  <div className="py-3 flex-grow">
    <div className="flex-row">
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
      {truncateText({ text: description, length: 100 })}
    </p>
  </div>
);

export default LeagueCard;