const queryString = require('query-string');
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

function handleOldActivity(activity) {
  if (!activity.length) return;
  console.log(activity);
  const feed = $('#activity__feed')[0];

  // current scroll height
  const scrollPosition = feed.scrollHeight - ($(feed).height() + feed.scrollTop);

  activity.forEach(action => {
    const firstDay = moment(activityItems[0].date).format('YYYY-MM-DD')
    const actionDay = moment(action.date).format('YYYY-MM-DD');
    $(feed).prepend(render.action(action));
    if (moment(actionDay).isBefore(firstDay)) {
      $(feed).prepend(render.dateSeparator(action.date));
    }
    activityItems.unshift(action);
  });
  $(feed).scrollTop(feed.scrollHeight - scrollPosition);
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

$('#activity__feed').on('scroll', function(e) {
  const feed = $(this)[0];
  if (feed.scrollTop != 0) return;

  $(feed).addClass('ovy-hidden');
  $(feed).prepend(render.loading);

  let query = queryString.parse(location.search);
  query.olderThan = activityItems[0].date;
  const string = queryString.stringify(query);
  console.log(string);

  $.ajax({
    type: "GET",
    url: `/activity?${string}`,
    headers: {
      Accept: 'application/json'
    },
    error: function(err) {
      console.log(err.responseText);
      $(feed).removeClass('ovy-hidden');
      $(feed).find('.loading').remove();
    },
    success: (activity) => {
      console.log(activity);
      $(feed).removeClass('ovy-hidden');
      $(feed).find('.loading').remove();
      handleOldActivity(activity);
    },
  });
})