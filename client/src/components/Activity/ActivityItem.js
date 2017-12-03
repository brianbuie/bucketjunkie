import React from 'react';
import moment from 'moment';

const ActivityItem = ({ category, user, date, message }) => (
  <div className={`py-1 px-2 Activity__Item--${category}`}>
    <strong className="pr-1">{user.username}</strong>
    <span title={moment(date).format('YYYY-MM-DD HH:mm')}>
      {message}
    </span>
  </div>
);

export default ActivityItem;