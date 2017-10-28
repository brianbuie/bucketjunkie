
// webpack delay on inlining styles causes a delay in getting the actual height
// this is bullshit that shouldn't be there in prod
setTimeout(() => {
  const feed = $('#activity__feed');
  const height = feed[0].scrollHeight;
  feed.scrollTop(height);
}, 1000);

setTimeout(() => {
  $.ajax({
    url: '/activity'
  }).done(function(data) {
    console.log(data);
  })
}, 1000);