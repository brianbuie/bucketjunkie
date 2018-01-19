import React from 'react';
import moment from 'moment';
import { calendarFormat } from 'helpers';
import MemberPhoto from 'components/User/MemberPhoto';

const ActivityItemChat = ({ user, date, message, self }) => (
  <div className={`Activity__Item Activity__Item--chat ${self && 'self'}`}>
    <div className="Chat">
      <div className="Chat__photo">
        <MemberPhoto id={user._id} />
      </div>
      <div className="Chat__content">
        <small className="Chat__username">{user.username}</small>
        <p className="Chat__message" title={moment(date).format('YYYY-MM-DD HH:mm')}>
          {message}
        </p>
      </div>
    </div>
  </div>
);

const ActivityItemDate = ({ date }) => (
  <div className="Activity__Item Activity__Item--date">
    <span title={moment(date).format('YYYY-MM-DD')}>
      {moment(date).calendar(null, calendarFormat)}
    </span>
  </div>
);

const ActivityItemAction = ({ category, user, date, message }) => (
  <div className={`Activity__Item Activity__Item--${category}`}>
    <strong className="pr-1">{user.username}</strong>
    <span title={moment(date).format('YYYY-MM-DD HH:mm')}>
      {message}
    </span>
  </div>
);

const ActivityItem = props => (
  <div>
    {props.includeDate && <ActivityItemDate date={props.date} />}
    {props.category === 'chat' 
      ? <ActivityItemChat {...props} />
      : <ActivityItemAction {...props} />}
  </div>
);

export default ActivityItem;