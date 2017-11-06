$('#countdown-timer').each(function() {
  const $timer = $(this);
  const startTime = moment($(this).data('start')).unix();
  const currentTime = moment().unix();
  const diffTime = startTime - currentTime;
  const interval = 1000;
  let duration = moment.duration(diffTime * 1000, 'milliseconds');

  if (diffTime < 0) return;

  const $d = $(this).find('.days .value');
  const $h = $(this).find('.hours .value');
  const $m = $(this).find('.minutes .value');
  const $s = $(this).find('.seconds .value');

  setInterval(function() {
    duration = moment.duration(duration.asMilliseconds() - interval, 'milliseconds');

    if (duration < 0) return;

    if (duration < 60 * 60 * 1000) {
      $('#countdown-timer .value').addClass('text-danger');
    }

    let d = moment.duration(duration).days();
    let h = moment.duration(duration).hours();
    let m = moment.duration(duration).minutes();
    let s = moment.duration(duration).seconds();

    d = $.trim(d).length === 1 ? '0' + d : d;
    h = $.trim(h).length === 1 ? '0' + h : h;
    m = $.trim(m).length === 1 ? '0' + m : m;
    s = $.trim(s).length === 1 ? '0' + s : s;

    $d.text(d);
    $h.text(h);
    $m.text(m);
    $s.text(s);

  }, interval);

});