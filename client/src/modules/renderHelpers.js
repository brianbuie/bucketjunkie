exports.action = function(action) {
  return `
    <div class="py-1 px-2 activity__item--${action.category}">
      <strong class="pr-1">${action.user.username}</strong>
      <span title="${moment(action.date).format('YYYY-MM-DD HH:mm')}">${action.message}</span>
    </div>
  `;
};

exports.dateSeparator = function(date) {
  const calendarFormat = {
    lastDay : '[Yesterday]',
    sameDay : '[Today]',
    nextDay : '[Tomorrow]',
    lastWeek : 'dddd',
    nextWeek : 'dddd',
    sameElse : 'L'
  };
  return `
    <div class="py-2 mx-auto text-center activity__item--date">
      <span title="${moment(date).format('YYYY-MM-DD')}">
        ${moment(date).calendar(null, calendarFormat)}
      </span>
    </div>
  `;
}