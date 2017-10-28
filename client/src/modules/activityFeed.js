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
    success: function(activity) {
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