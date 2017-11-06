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
};

exports.loading = function() {
  return `
    <div class="loading text-center my-3">
      <img class="fa-spin" src="/images/icons/icon.svg" />
    </div>
  `;
};

exports.error = function(message) {
  return `
    <div class="alert alert-dismissible mx-auto my-0 slide-in alert-error" role="alert">
      <button class="close" aria-label="Close" type="button" data-dismiss="alert"> 
        <span aria-hidden="true"> &times; <span>
      </button>
      ${message}
    </div>
  `;
};