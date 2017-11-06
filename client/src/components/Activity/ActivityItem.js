import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const ActivityItem = ({ category, user, date, message }) => (
  <div className={`py-1 px-2 activity__item--${category}`}>
    <strong className="pr-1">{user.username}</strong>
    <span title={moment(date).format('YYYY-MM-DD HH:mm')}>
      {message}
    </span>
  </div>
);

ActivityItem.propTypes = {
  category: PropTypes.string.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,
  date: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default ActivityItem;