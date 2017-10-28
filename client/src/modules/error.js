module.exports = function(err) {
  $('#errors').append(`
    <div class="alert alert-dismissible fade show alert-error" role="alert">
      <button class="close" aria-label="Close" type="button" data-dismiss="alert"> 
        <span aria-hidden="true"> &times; <span>
      </button>
      ${err.message}
    </div>
  `);
};