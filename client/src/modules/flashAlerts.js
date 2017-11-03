$('.alert.slide-in').each(function() {
  const $alert = $(this);
  setTimeout(() => { $alert.addClass('show') }, 500);
  setTimeout(() => { dismissAlert($alert) }, 4000);
});

function dismissAlert($alert) {
  $alert.removeClass('show');
  const duration = parseFloat($alert.css('transitionDuration')) * 1000;
  setTimeout(() => { $alert.remove() }, duration);
}

$('.alert.slide-in').on('close.bs.alert', function (e) {
  e.preventDefault();
  dismissAlert($(this));
});