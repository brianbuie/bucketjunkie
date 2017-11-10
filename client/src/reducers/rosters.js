const rosters = (state = [], action) => {
  switch (action.type) {
    case 'REPLACE_ROSTER':
      return [
        ...state.filter(roster => roster.user.id != action.roster.user.id),
        action.roster
      ];
    default:
      return state;
  }
};

export default rosters;