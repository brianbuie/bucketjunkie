const queryString = require('query-string');
const moment = require('moment');
const error = require('./error');
const render = require('./renderHelpers');

let activityItems = [];
let activityTimeout;

function generateQueryString() {
  let query = queryString.parse(location.search);
  if (activityItems.length) query.newerThan = activityItems[activityItems.length - 1].date;
  return queryString.stringify(query);
}

function getNewActivity() {
  const string = generateQueryString();
  $.ajax({
    type: "GET",
    url: `/activity?${string}`,
    headers: {
      Accept: 'application/json'
    },
    success: (activity) => handleNewActivity(activity),
    error: function(err) {
      error(err.responseJSON);
      console.log(err.responseText);
      activityTimeout = setTimeout(getNewActivity, 5000);
    },
  });
}

function handleNewActivity(activity) {
  activityTimeout = setTimeout(getNewActivity, 10000);
  if (!activity.length) return;
  console.log(activity);
  const feed = $('#activity__feed')[0];
  // only auto scroll down if within 100px of the bottom
  const autoScroll = feed.scrollHeight - ($(feed).height() + feed.scrollTop) < 100;

  activity.forEach(action => {
    const lastDay = activityItems.length
      ? moment(activityItems[activityItems.length - 1].date).format('YYYY-MM-DD')
      : '1988-04-08'; // Happy birthday to me!
    const newDay = moment(action.date).format('YYYY-MM-DD');
    if (moment(newDay).isAfter(lastDay)) {
      $(feed).append(render.dateSeparator(action.date));
    }
    $(feed).append(render.action(action));
    activityItems.push(action);
  });
  if (autoScroll) $(feed).scrollTop(feed.scrollHeight);
}
if ($('#activity__feed')[0]) {
  getNewActivity();
}

$('#chat__form').submit((e) => {
  e.preventDefault();
  if (!$('#chat__input').val()) return;
  const string = generateQueryString();
  clearTimeout(activityTimeout);
  $.ajax({
    type: "POST",
    url: `/activity/chat?${string}`,
    data: $('#chat__form').serialize(),
    headers: {
      Accept: 'application/json'
    },
    success: (activity) => {
      $('#chat__input').val('');
      handleNewActivity(activity);
    },
    error: function(err) {
      error(err.responseJSON);
      console.log(err.responseJSON);
      handleNewActivity([]);
    },
  });
});