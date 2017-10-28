const queryString = require('query-string');
const error = require('./error');
const renderAction = require('./renderAction');

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
      console.log(err.responseText);
      activityTimeout = setTimeout(getNewActivity, 5000);
    },
  });
}

function handleNewActivity(activity) {
  if (activity.length) console.log(activity);
  const feed = $('#activity__feed')[0];
  activity.forEach(action => {
    $(feed).append(renderAction(action));
    activityItems.push(action);
    $(feed).scrollTop(feed.scrollHeight);
  });
  activityTimeout = setTimeout(getNewActivity, 10000);
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