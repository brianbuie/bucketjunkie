$('.utc-offset').val(new Date().getTimezoneOffset() / 60);

$('.utc-to-local').each(function() {
  const local = moment.utc(this.value).local();
  this.value = local.format('YYYY-MM-DDTHH:mm');
});