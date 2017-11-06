const render = require('./renderHelpers');

$(document).on('click', '.app__nav', function(e) {
  e.preventDefault();
  getContent($(this).attr('href'));
});

function getContent(url) {
  $('#app').html(render.loading());
  $.ajax({
    type: "GET",
    url,
    success: content => $('#app').html(content),
    error: err => $('#app').html('Error'),
  });
}

getContent('/api/league/leaderboard');