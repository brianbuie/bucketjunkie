const moment = require('moment');

module.exports = function(action) {
  return `
    <div class="py-1 px-2 activity__item--${action.category}">
      <strong class="pr-1">${action.user.username}</strong>
      <span title="${moment(action.date).format('YYYY-MM-DD HH:mm')}">${action.message}</span>
    </div>
  `;
};