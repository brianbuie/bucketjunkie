const queryString = require('query-string');
const render = require('./renderHelpers');

let activityItems = [];
let category = "all";
let noMoreOlderActivity = false;
let consecutiveErrors = 0;
const errorThreshold = 5;
const activityRefreshRate = 5000;
let activityTimeout;

function handleError(err, next) {
  consecutiveErrors++;
  console.error(err);
  if (consecutiveErrors > errorThreshold) {
    return $('#flashes').append(render.error('Error getting activity, try refreshing the page'));
  }
  next();
}

function getNewActivity() {
  const query = { category };
  if (activityItems.length) query.newerThan = activityItems[activityItems.length-1].date;
  $.ajax({
    type: "GET",
    url: `/api/activity?${queryString.stringify(query)}`,
    headers: {
      Accept: 'application/json'
    },
    success: activity => handleNewActivity(activity),
    error: err => handleError(err, () => handleNewActivity([])),
  });
}

function handleNewActivity(activity) {
  activityTimeout = setTimeout(getNewActivity, activityRefreshRate);
  if (!activity.length) return;
  consecutiveErrors = 0;
  console.log(activity);
  const feed = $('#activity__feed')[0];
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
  const feed = $('#activity__feed')[0];
  $(feed).removeClass('ovy-hidden');
  $(feed).find('.loading').remove();
  if (!activity.length) return noMoreOlderActivity = true;
  console.log(activity);
  const initialScrollHeight = feed.scrollHeight;
  activity.reverse().forEach(action => {
    const firstDay = moment(activityItems[0].date).format('YYYY-MM-DD')
    const actionDay = moment(action.date).format('YYYY-MM-DD');
    $(feed).prepend(render.action(action));
    if (moment(actionDay).isBefore(firstDay)) {
      $(feed).prepend(render.dateSeparator(action.date));
    }
    activityItems.unshift(action);
  });
  const newScrollHeight = feed.scrollHeight;
  $(feed).scrollTop(newScrollHeight - initialScrollHeight);
}

if ($('#activity__feed')[0]) {
  getNewActivity();
}

$('.activity__filter').click(function(e) {
  e.preventDefault();
  clearTimeout(activityTimeout);
  $('.activity__filter').removeClass('active');
  $(this).addClass('active');
  category = $(this).data('category');
  if (['all', 'chat'].includes(category)) {
    $('#chat__form').removeClass('hide');
  } else {
    $('#chat__form').addClass('hide');
  }
  noMoreOlderActivity = false;
  activityItems = [];
  $('#activity__feed').empty();
  getNewActivity();
});

$('#chat__form').submit((e) => {
  e.preventDefault();
  const $input = $('#chat__input');
  if (!$input.val()) return;
  const query = { category };
  if (activityItems.length) query.newerThan = activityItems[activityItems.length-1].date;
  clearTimeout(activityTimeout);
  $.ajax({
    type: "POST",
    url: `/api/activity/chat?${queryString.stringify(query)}`,
    data: $('#chat__form').serialize(),
    headers: {
      Accept: 'application/json'
    },
    success: (activity) => {
      $input.val('');
      $input.removeClass('is-invalid');
      handleNewActivity(activity);
    },
    error: err => handleError(err, () => {
      $input.addClass('is-invalid');
      handleNewActivity([]);
    }),
  });
});

$('#activity__feed').on('scroll', function(e) {
  const feed = $(this)[0];
  if (feed.scrollTop != 0 || noMoreOlderActivity || !activityItems.length) return;
  $(feed).addClass('ovy-hidden');
  $(feed).prepend(render.loading);
  const query = { category };
  query.olderThan = activityItems[0].date;
  $.ajax({
    type: "GET",
    url: `/api/activity?${queryString.stringify(query)}`,
    headers: {
      Accept: 'application/json'
    },
    success: activity => handleOldActivity(activity),
    error: err => handleError(err, () => handleOldActivity([])),
  });
});