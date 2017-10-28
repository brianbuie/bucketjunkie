module.exports = function(action) {
  return `
    <div class="py-1 px-2 activity__item--${action.category}">
      <strong class="pr-2">${action.user.username}</strong>
      <span>${action.message}</span>
    </div>
  `;
};