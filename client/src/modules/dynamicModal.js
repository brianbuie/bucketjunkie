$('#dynamicModal').on('show.bs.modal', function (event) {
  const btn = $(event.relatedTarget);
  const modal = $(this);

  modal.find('.modal-title')
    .text(btn.data('title'));

  modal.find('.modal-body')
    .text(btn.data('body'));

  modal.find('form')
    .attr('method', btn.data('form-method'))
    .attr('action', btn.data('form-action'));

  modal.find('form input')
    .attr('name', btn.data('input-name'))
    .attr('value', btn.data('input-value'));

  modal.find('form button')
    .removeClass()
    .addClass(`btn ${btn.data('button-class')}`)
    .text(btn.data('button-text'));
});