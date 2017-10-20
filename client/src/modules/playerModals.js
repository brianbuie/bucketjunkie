$(document).ready(function(){
  $('.playerModal').on('show.bs.modal', function (event) {
    console.log('playerModal called');
    const button = $(event.relatedTarget);
    const playerName = button.data('playername');
    const playerId = button.data('playerid');
    const modal = $(this);
    modal.find('.modal-body').text(playerName);
    modal.find('input[name="player"]').val(playerId);
  });
});