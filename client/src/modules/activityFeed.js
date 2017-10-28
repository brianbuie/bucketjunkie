const error = require('./error');

function renderAction(action) {
  return `
    <div class="py-1 px-2 activity__item--${action.category}">
      <strong class="pr-2">${action.user.username}</strong>
      <span>${action.message}</span>
    </div>
  `;
}

function activityFeed() {
  const feed = $('#activity__feed')[0];
  if (!feed) return;
  $.ajax({
    type: "GET",
    url: `/activity${location.search}`,
    headers: {
      Accept: 'application/json'
    },
    success: function(activity) {
      console.log(activity);
      activity.forEach(action => {
        $(feed).append(renderAction(action));
      });
      const height = feed.scrollHeight;
      $(feed).scrollTop(height);
    },
    error: function(err) {
      console.log(err.responseText);
    },
  });
}
activityFeed();

$('#chat__form').submit((e) => {
  e.preventDefault();
  if (!$('#chat__input').val()) return;
  $.ajax({
    type: "POST",
    url: `/activity/chat`,
    data: $('#chat__form').serialize(),
    headers: {
      Accept: 'application/json'
    },
    success: function(action) {
      const feed = $('#activity__feed')[0];
      $('#chat__input').val('');
      $(feed).append(renderAction(action));
      const height = feed.scrollHeight;
      $(feed).scrollTop(height);
    },
    error: function(err) {
      error(err.responseJSON);
      console.log(err.responseJSON);
    },
  });
});