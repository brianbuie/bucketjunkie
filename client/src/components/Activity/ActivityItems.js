import React from 'react';
import moment from 'moment';
import { calendarFormat } from 'helpers';

export const ActivityItem = ({ category, user, date, message }) => (
  <div className={`Activity__Item Activity__Item--${category}`}>
    <strong className="pr-1">{user.username}</strong>
    <span title={moment(date).format('YYYY-MM-DD HH:mm')}>
      {message}
    </span>
  </div>
);

export const ActivityItemDate = ({ date }) => (
  <div className="Activity__Item Activity__Item--date">
    <span title={moment(date).format('YYYY-MM-DD')}>
      {moment(date).calendar(null, calendarFormat)}
    </span>
  </div>
);

export default ActivityItem;