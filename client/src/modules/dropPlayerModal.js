$(document).ready(function(){
  $('#dropPlayer').on('shown.bs.modal', function (event) {
    console.log('dropPlayer called');
    const button = $(event.relatedTarget);
    const playerName = button.data('playername');
    const modal = $(this);
    modal.find('.modal-body').val(playerName);
  });
});