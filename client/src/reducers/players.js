const players = (state = [], action) => {
  switch (action.type) {
    case 'REPLACE_ROSTER':
      return state.map(player => {
        let user = action.roster.user;
        if (player.takenBy && player.takenBy._id === user._id) player.takenBy = null;
        if (action.roster.players.some(p => p._id === player._id)) player.takenBy = user;
        return player;
      });
    default:
      return state;
  }
};

export default players;